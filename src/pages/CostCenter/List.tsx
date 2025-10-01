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
import { CostCenter } from "@/types/CostCenter/CostCenter";

export default function CostCenterList() {
  const [centers, setCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    apiClient
      .get("/CostCenter")
      .then((res) => setCenters(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: CostCenter) => {
    navigate(`/centros-de-custo/editar/${u.id}`);
  };

  const handleExcluir = async (u: CostCenter) => {
    try {
      await apiClient.delete(`/CostCenter/${u.id}`);
      showDeletedToast();
      setCenters((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      showErrorToast("Erro ao deletar centro de custo: " + error);
    }
  };

  const handleStatus = async (u: CostCenter, action: "activate" | "deactivate") => {
    try {
      const endpoint = action === "activate" ? `CostCenter/activate/${u.id}` : `CostCenter/deactivate/${u.id}`; 
        await apiClient.patch(endpoint);
        const response = await apiClient.get("/CostCenter");
        setCenters(response.data);

        showEditedSuccessfullyToast();
    } catch (error) {
      showErrorToast("Erro ao atualizar status do centro de custo: " + error);
    }
    };



  const columns = [
    { key: "name", label: "Nome" },
    { key: "departmentName", label: "Departamento" },
    {
      key: "status",
      label: "Status",
      render: (c: CostCenter) =>
        <Badge size="sm" color={c.status == true ? "success" : "error"}>
          {c.status == true ? "Ativo" : "Inativo"}
        </Badge>
    },
    {
      label: "Ações",
      render: (u: CostCenter) => (
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-40">
                    {u.status === false ? (
                        <DropdownMenuItem onClick={() => handleStatus(u, "activate")}>
                        Ativar
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem onClick={() => handleStatus(u, "deactivate")}>
                        Desativar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuSubContent>

              </DropdownMenuSub>
            
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
    
  const filteredCenters = centers.filter((c) => {
    return (
        c.name.toLowerCase().includes(filterNome.toLowerCase())
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Centros de Custo" description="Lista de Centros de Custo" />
      <PageBreadcrumb pageTitle="Centros de Custo" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Centros de Custo">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/centros-de-custo/criar")}
              >
                Novo centro de custo
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

          <GenericTable columns={columns} data={filteredCenters} />
        </ComponentCard>
      </div>
    </>
  );
}
