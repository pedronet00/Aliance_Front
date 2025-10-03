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
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { PastoralVisit } from "@/types/PastoralVisit/PastoralVisit";

export default function PastoralVisitList() {
  const [visits, setVisits] = useState<PastoralVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/PastoralVisit")
      .then((res) => setVisits(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const columns = [
    { key: "visitDate", label: "Data da Visita", render: (v: PastoralVisit) => new Date(v.visitDate).toLocaleDateString() },
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

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(v)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/visitas-pastorais/${v.guid}`)}>
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
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
      <PageBreadcrumb pageTitle="Visitas Pastorais" />
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

          <GenericTable columns={columns} data={filteredVisits} />
        </ComponentCard>
      </div>
    </>
  );
}
