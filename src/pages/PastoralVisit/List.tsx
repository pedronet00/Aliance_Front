import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
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
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast, showToggleStatusToast } from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { PastoralVisit } from "@/types/PastoralVisit/PastoralVisit";
import VisitDescriptionModal from "./DescriptionModal";
import NoData from "@/components/no-data";

export default function PastoralVisitList() {
  const [visits, setVisits] = useState<PastoralVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<PastoralVisit | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchVisits = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/PastoralVisit/paged?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data;
      setVisits(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);

      if (currentPage !== data.currentPage) {
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      showErrorToast("Erro ao carregar visitas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(1);
  }, []);

  const handleEditar = (visit: PastoralVisit) => {
    navigate(`/visitas-pastorais/editar/${visit.guid}`);
  };

  const handleExcluir = async (visit: PastoralVisit) => {
    try {
      await apiClient.delete(`/PastoralVisit/${visit.guid}`);
      showDeletedToast();
      setVisits((prev) => prev.filter((v) => v.guid !== visit.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar visita pastoral: " + error);
    }
  };

  const handleToggleStatus = async (visit: PastoralVisit, newStatus: string) => {
    try {
      await apiClient.patch(`/PastoralVisit/${visit.guid}/status/${newStatus}`);
      setVisits((prev) =>
        prev.map((v) =>
          v.guid === visit.guid ? { ...v, status: newStatus } : v
        )
      );
      showToggleStatusToast;
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { 
      key: "visitDate", 
      label: "Data da Visita", 
      render: (v: PastoralVisit) =>
        new Date(v.visitDate).toLocaleString("pt-BR", { 
          dateStyle: "medium", 
          timeStyle: "medium" 
        })
    },
    { key: "pastorName", label: "Pastor" },
    { key: "visitedMemberName", label: "Visitado" },
    {
      key: "status",
      label: "Status",
      render: (v: PastoralVisit) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          Agendado: { color: "warning", label: "Agendado" },
          Completado: { color: "success", label: "Completado" },
          Cancelado: { color: "error", label: "Cancelado" },
          Adiado: { color: "default", label: "Adiado" },
        };

        const status = statusMap[v.status] ?? { color: "default", label: v.status };

        return <Badge size="sm" color={status.color}>{status.label}</Badge>;
      }
    },
    {
      label: "Ações",
      render: (v: PastoralVisit) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled={v.status == "Completado" || v.status == "Cancelado"} onClick={() => handleEditar(v)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedVisit(v)}>
              Ver detalhes
            </DropdownMenuItem>

            {v.status != "Completado" && v.status != "Cancelado" && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44">
                {["Agendado", "Completado", "Cancelado", "Adiado"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => handleToggleStatus(v, s)}
                    disabled={v.status === s}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={v.status == "Completado" || v.status == "Cancelado"} 
              onClick={() => handleExcluir(v)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredVisits = visits.filter((v) => {
    const matchesDescription = v.description.toLowerCase().includes(filterDescription.toLowerCase());
    const matchesStatus = filterStatus ? v.status === filterStatus : true;
    return matchesDescription && matchesStatus;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Visitas Pastorais" description="Lista de Visitas Pastorais" />
      <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Visitas Pastorais", path: "/visitas-pastorais" },
          ]}
        />
      <VisitDescriptionModal visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
      <div className="space-y-6">
        <ComponentCard title="Lista de Visitas Pastorais">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/visitas-pastorais/criar")}>
                Nova Visita
              </Button>
              <Button variant="secondary" onClick={() => setShowFilters((prev) => !prev)}>
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <input
                  type="text"
                  placeholder="Filtrar por descrição"
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os Status</option>
                  <option value="Agendado">Agendado</option>
                  <option value="Completado">Completado</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Adiado">Adiado</option>
                </select>
              </div>
            )}
          </div>

          {filteredVisits.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredVisits} />

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
