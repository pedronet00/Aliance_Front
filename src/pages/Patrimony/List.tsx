import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showEditedSuccessfullyToast, showErrorToast} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { Patrimony } from "@/types/Patrimony/Patrimony";
import { render } from "@fullcalendar/core/preact.js";
import UploadDocumentModal from "./DocumentUploadModal";

export default function PatrimonyList() {
  const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    apiClient
      .get("/Patrimony")
      .then((res) => setPatrimonies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: Patrimony) => {
    navigate(`/patrimonios/editar/${u.guid}`);
  };

  const handleExcluir = async (u: Patrimony) => {
    try {
      await apiClient.delete(`/Patrimony/${u.id}`);
      showDeletedToast();
      setPatrimonies((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      showErrorToast("Erro ao deletar centro de custo: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    { key: "unitValue", label: "Valor Unitário", render: (u: Patrimony) => `R$ ${u.unitValue.toFixed(2)}` },
    { key: "quantity", label: "Quantidade" },
    { key: "totalValue", label: "Valor Total", render: (u: Patrimony) => `R$ ${u.totalValue.toFixed(2)}` },
    { key: "acquisitionDate", label: "Data de Aquisição", render: (u: Patrimony) => new Date(u.acquisitionDate).toLocaleDateString() },
    { key: "condition", label: "Condição" },
    {
      label: "Ações",
      render: (u: Patrimony) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(u)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/patrimonios/${u.guid}/documentos`)}>
              Ver documentos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(u)}
              className="text-destructive focus:text-destructive"
            >
              <span>Excluir</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
    
  const filteredPatrimonies = patrimonies.filter((c) => {
    return (
        c.name.toLowerCase().includes(filterNome.toLowerCase())
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Patrimônios" description="Lista de Patrimônios" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Patrimônios", path: "/patrimonios" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Patrimônios">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/patrimonios/criar")}
              >
                Novo patrimônio
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <input
                  type="text"
                  placeholder="Filtrar por descrição"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>

          <GenericTable columns={columns} data={filteredPatrimonies} />
        </ComponentCard>
      </div>
    </>
  );
}
