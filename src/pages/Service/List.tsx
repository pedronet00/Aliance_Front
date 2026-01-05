import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import {
  showDeletedToast,
  showErrorToast,
  showToggleStatusToast,
} from "@/components/toast/Toasts";
import { Service } from "@/types/Service/Service";
import NoData from "@/components/no-data";
import { useAuth } from "@/context/AuthContext";

export default function ServiceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const {can} = useAuth();

  const navigate = useNavigate();

  const fetchServices = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Service/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result;

      setServices(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Erro ao carregar cultos:", err);
      showErrorToast("Erro ao carregar cultos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [currentPage]);

  const handleEditar = (service: Service) => {
    navigate(`/cultos/editar/${service.guid}`);
  };

  const handleExcluir = async (service: Service) => {
    try {
      await apiClient.delete(`/Service/${service.guid}`);
      setServices((prev) => prev.filter((s) => s.guid !== service.guid));
      showDeletedToast();
    } catch (err) {
      showErrorToast("Erro ao excluir culto: " + err);
    }
  };

  const handleToggleStatus = async (service: Service, newStatus: string) => {
    try {
      await apiClient.patch(`/Service/${service.guid}/status/${newStatus}`);
      setServices((prev) =>
        prev.map((s) =>
          s.guid === service.guid ? { ...s, status: newStatus } : s
        )
      );
      showToggleStatusToast();
    } catch (err) {
      showErrorToast("Erro ao atualizar status: " + err);
    }
  };

  const columns = [
    {
      key: "date",
      label: "Data do Culto",
      render: (s: Service) =>
        new Date(s.date).toLocaleString("pt-BR", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    },
    { key: "locationName", label: "Local" },
    {
      key: "status",
      label: "Status",
      render: (s: Service) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          Agendado: { color: "primary", label: "Agendado" },
          Completado: { color: "success", label: "Completado" },
          Cancelado: { color: "error", label: "Cancelado" },
          Pendente: { color: "warning", label: "Pendente" },
        };
        const status = statusMap[s.status] ?? {
          color: "default",
          label: s.status,
        };
        return (
          <Badge size="sm" color={status.color}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      label: "Ações",
      render: (s: Service) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => navigate(`/cultos/${s.guid}/escalas`)}>Escalas</DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/cultos/${s.guid}/presencas`)}>Presenças</DropdownMenuItem>
            {can(["Admin", "Pastor","Secretaria"]) && (
              <>
              {s.status != "Completado" && (
                <DropdownMenuItem onClick={() => handleEditar(s)}>
                  Editar
                </DropdownMenuItem>
              )}

              {s.status != "Completado" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-44">
                      {["Completado", "Cancelado", "Adiado"].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleToggleStatus(s, status)}
                          disabled={s.status === status}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleExcluir(s)}
                    className="text-destructive focus:text-destructive"
                  >
                    Excluir
                  </DropdownMenuItem>
                </>
              )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta
        title="Cultos"
        description="Lista de cultos realizados ou agendados"
      />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Cultos", path: "/cultos" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Cultos">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              {can(["Admin", "Pastor","Secretaria"]) && (
              <Button onClick={() => navigate("/cultos/criar")}>
                Novo Culto
              </Button>
              )}
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
                  placeholder="Filtrar por local"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os Status</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Realizado">Realizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          {services.length > 0 ? (
            <>
              <GenericTable columns={columns} data={services} />

              {/* Paginação */}
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Página {currentPage} de {totalPages} — Total: {totalCount}
                </p>

                <div className="flex justify-center gap-2 md:justify-end">
                  <Button
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
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
