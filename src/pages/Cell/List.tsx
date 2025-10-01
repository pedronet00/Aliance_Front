import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { Cell } from "@/types/Cell/Cell";

export default function CellList() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    apiClient
      .get("/Cell")
      .then((res) => setCells(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: Cell) => {
    navigate(`/orcamentos/editar/${u.id}`);
  };

  const handleExcluir = async (u: Cell) => {
    try {
      await apiClient.delete(`/Cell/${u.id}`);
      showDeletedToast();
      setCells((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      showErrorToast("Erro ao deletar célula: " + error);
    }
  };


  const columns = [
    { key: "name", label: "Nome" },
    { key: "locationName", label: "Local" },
    { key: "leaderName", label: "Líder" },
    { key: "meetingDay", label: "Dia de reunião" },
    {
      label: "Ações",
      render: (u: Cell) => (
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
    
  const celulasFiltradas = cells.filter((c) => {
    return (
        c.name.toLowerCase().includes(filterNome.toLowerCase())
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Células" description="Lista de Células" />
      <PageBreadcrumb pageTitle="Células" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Células">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/orcamentos/criar")}
              >
                Nova célula
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

          <GenericTable columns={columns} data={celulasFiltradas} />
        </ComponentCard>
      </div>
    </>
  );
}
