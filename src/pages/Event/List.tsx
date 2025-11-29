import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Event } from "@/types/Event/Event";
import NoData from "@/components/no-data";
import { useAuth } from "@/context/AuthContext";

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const {can} = useAuth();

  const navigate = useNavigate();

  const fetchEvents = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Event/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data;
      setEvents(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  const handleEditar = (ev: Event) => {
    navigate(`/eventos/editar/${ev.guid}`);
  };

  const handleExcluir = async (ev: Event) => {
    try {
      await apiClient.delete(`/Event/${ev.guid}`);
      showDeletedToast();
      fetchEvents(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar evento: " + error);
    }
  };

  const handleStatusChange = async (ev: Event, newStatus: string) => {
    try {
      await apiClient.patch(`/Event/${ev.guid}/status/${newStatus}`);
      showEditedSuccessfullyToast();
      fetchEvents(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status do evento: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    {
      key: "date",
      label: "Data",
      render: (e: Event) => new Date(e.date).toLocaleDateString("pt-BR"),
    },
    {
      key: "cost",
      label: "Custo",
      render: (e: Event) =>
        e.cost > 0 ? `R$ ${e.cost.toFixed(2)}` : "Gratuito",
    },
    { key: "locationName", label: "Local" },
    {
      key: "status",
      label: "Status",
      render: (e: Event) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            e.status === "Completado"
              ? "bg-green-100 text-green-700"
              : e.status === "Adiado"
              ? "bg-yellow-100 text-yellow-700"
              : e.status === "Cancelado"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {e.status}
        </span>
      ),
    },
    {
      label: "Ações",
      render: (e: Event) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>
          {can(["Admin", "Pastor", "Eventos","Secretaria"]) && (
          <DropdownMenuContent align="end" className="w-48">
            {/* <DropdownMenuItem onClick={() => handleEditar(e)}>
              Ver participantes
            </DropdownMenuItem> */}
            {e.status !== "Completado" && (
              <>
                <DropdownMenuItem onClick={() => handleEditar(e)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Alterar status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(e, "Completado")}
                    >
                      Concluído
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(e, "Adiado")}
                    >
                      Adiado
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(e, "Cancelado")}
                    >
                      Cancelado
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleExcluir(e)}
                  className="text-destructive focus:text-destructive"
                >
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
          )}
        </DropdownMenu>
      ),
    },
  ];

  const filteredEvents = events.filter((e) => {
    const matchName = e.name.toLowerCase().includes(filterName.toLowerCase());
    const matchStatus = filterStatus === "" ? true : e.status === filterStatus;
    return matchName && matchStatus;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Eventos" description="Lista de Eventos" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Eventos", path: "/eventos" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Eventos">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              {can(["Admin", "Pastor", "Eventos","Secretaria"]) && (
              <Button onClick={() => navigate("/eventos/criar")}>
                Novo evento
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
                  placeholder="Filtrar por nome"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os Status</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Completado">Concluído</option>
                  <option value="Adiado">Adiado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>
            )}
          </div>

          {filteredEvents.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredEvents} />

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
