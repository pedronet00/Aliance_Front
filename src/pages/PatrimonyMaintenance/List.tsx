import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import {
  showDeletedToast,
  showEditedSuccessfullyToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { PatrimonyMaintenance } from "@/types/PatrimonyMaintenance/PatrimonyMaintenance";
import { toast } from "react-toastify";
import NoData from "@/components/no-data";

export default function PatrimonyMaintenanceList() {
  const [maintenances, setMaintenances] = useState<PatrimonyMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchMaintenances = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/PatrimonyMaintenance/paged?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data;
      setMaintenances(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.currentPage);
    } catch (error) {
      showErrorToast("Erro ao carregar manutenções");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenances(currentPage);
  }, [currentPage]);

  const handleEditar = (u: PatrimonyMaintenance) => {
    navigate(`/manutencoes-patrimonios/editar/${u.guid}`);
  };

  const handleExcluir = async (u: PatrimonyMaintenance) => {
    try {
      await apiClient.delete(`/PatrimonyMaintenance/${u.guid}`);
      showDeletedToast();
      fetchMaintenances(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar manutenção: " + error);
    }
  };

  const handleToggleStatus = async (u: PatrimonyMaintenance, newStatus: string) => {
    if (newStatus === "Concluido") {
      toast.warn(
        ({ closeToast }) => (
          <div>
            <p>
              Tem certeza que deseja marcar como <b>Concluído</b>? Essa ação não é reversível.
            </p>
            <div className="flex justify-end mt-3 space-x-2">
              <Button size="sm" variant="outline" onClick={() => closeToast && closeToast()}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    await apiClient.patch(`/PatrimonyMaintenance/${u.guid}/status/${newStatus}`);
                    showEditedSuccessfullyToast();
                    fetchMaintenances(currentPage);
                  } catch (error) {
                    showErrorToast("Erro ao alterar status: " + error);
                  } finally {
                    closeToast && closeToast();
                  }
                }}
              >
                Confirmar
              </Button>
            </div>
          </div>
        ),
        { autoClose: false, closeOnClick: false }
      );
      return;
    }

    try {
      await apiClient.patch(`/PatrimonyMaintenance/${u.guid}/status/${newStatus}`);
      showEditedSuccessfullyToast("Status atualizado com sucesso");
      fetchMaintenances(currentPage);
    } catch (error) {
      showErrorToast("Erro ao alterar status: " + error);
    }
  };

  const columns = [
    { key: "patrimonyName", label: "Patrimônio" },
    {
      key: "maintenanceDate",
      label: "Data da manutenção",
      render: (c: PatrimonyMaintenance) =>
        new Date(c.maintenanceDate).toLocaleDateString(),
    },
    { key: "description", label: "Descrição" },
    {
      key: "Status",
      label: "Status",
      render: (c: PatrimonyMaintenance) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          Agendado: { color: "warning", label: "Agendado" },
          Concluido: { color: "success", label: "Concluído" },
          Cancelado: { color: "error", label: "Cancelado" },
        };

        const status = statusMap[c.status] ?? { color: "default", label: c.status };

        return (
          <Badge size="sm" color={status.color}>
            {status.label}
          </Badge>
        );
      },
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

          <DropdownMenuContent align="end" className="w-44">
            {u.status !== "Concluido" && (
              <DropdownMenuItem onClick={() => handleEditar(u)}>Editar</DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => navigate(`/manutencoes-patrimonios/${u.guid}/documentos`)}
            >
              Ver documentos
            </DropdownMenuItem>

            {u.status !== "Concluido" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  {["Agendado", "Concluido", "Cancelado"]
                    .filter((s) => s !== u.status)
                    .map((s) => (
                      <DropdownMenuItem key={s} onClick={() => handleToggleStatus(u, s)}>
                        {s}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {u.status !== "Concluido" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleExcluir(u)}
                  className="text-destructive focus:text-destructive"
                >
                  <span>Excluir</span>
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredMaintenances = maintenances.filter((c) => {
    const matchesDescription = c.description
      .toLowerCase()
      .includes(filterNome.toLowerCase());
    const matchesStatus =
      !filterStatus || c.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesDescription && matchesStatus;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta
        title="Manutenções de Patrimônios"
        description="Lista de Manutenções de Patrimônios"
      />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Manutenções de Patrimônios", path: "/manutencoes-patrimonios" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Manutenções de Patrimônios">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/manutencoes-patrimonios/criar")}>
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
                  <option value="Agendado">Agendado</option>
                  <option value="Concluido">Concluído</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          {filteredMaintenances.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredMaintenances} />

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} — Total: {totalCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <NoData />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
