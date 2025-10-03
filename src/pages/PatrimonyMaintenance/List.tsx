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
import { PatrimonyMaintenance } from "@/types/PatrimonyMaintenance/PatrimonyMaintenance";

export default function PatrimonyMaintenanceList() {
  const [centers, setMaintenances] = useState<PatrimonyMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    apiClient
      .get("/PatrimonyMaintenance")
      .then((res) => setMaintenances(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: PatrimonyMaintenance) => {
    navigate(`/manutencoes-patrimonios/editar/${u.guid}`);
  };

  const handleExcluir = async (u: PatrimonyMaintenance) => {
    try {
      await apiClient.delete(`/PatrimonyMaintenance/${u.guid}`);
      showDeletedToast();
      setMaintenances((prev) => prev.filter((c) => c.guid !== u.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar centro de custo: " + error);
    }
  };

  const columns = [
    { key: "patrimonyName", label: "Patrimônio" },
    { key: "maintenanceDate", label: "Data da manutenção", render: (c: PatrimonyMaintenance) => new Date(c.maintenanceDate).toLocaleDateString() },
    { key: "description", label: "Descrição" },
    {
        key: "Status",
        label: "Status",
        render: (c: PatrimonyMaintenance) => {
            const statusMap: Record<string, { color: string; label: string }> = {
            Agendado:   { color: "warning", label: "Agendado" },
            Concluido:       { color: "success", label: "Concluido" },
            Cancelado:   { color: "error",   label: "Cancelado" },
            };

            const status = statusMap[c.status] ?? { color: "default", label: c.status };

            return (
            <Badge size="sm" color={status.color}>
                {status.label}
            </Badge>
            );
        }
    },
    {
      label: "Ações",
      render: (u: PatrimonyMaintenance) => (
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
            <DropdownMenuItem onClick={() => navigate(`/manutencoes-patrimonios/${u.guid}/documentos`)}>
              Ver documentos
            </DropdownMenuItem>
                {/* <DropdownMenuSub>
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
                </DropdownMenuSub> */}
            
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
    
  const filteredMaintenances = centers.filter((c) => {
    return (
        c.description.toLowerCase().includes(filterNome.toLowerCase())
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Manutenções de Patrimônios" description="Lista de Manutenções de Patrimônios" />
      <PageBreadcrumb pageTitle="Manutenções de Patrimônios" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Manutenções de Patrimônios">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/manutencoes-patrimonios/criar")}
              >
                Nova manutenção
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

          <GenericTable columns={columns} data={filteredMaintenances} />
        </ComponentCard>
      </div>
    </>
  );
}
