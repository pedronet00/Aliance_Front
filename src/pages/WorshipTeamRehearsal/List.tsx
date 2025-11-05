import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { Button } from "@/components/ui/button";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Badge from "@/components/ui/badge/Badge";
import ComponentCard from "@/components/common/ComponentCard";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NoData from "@/components/no-data";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";

type WorshipTeamRehearsal = {
  id: number;
  guid: string;
  rehearsalDate: string;
  worshipTeamId: number;
  status: string;
};

export default function WorshipTeamRehearsalList() {
  const [rehearsals, setRehearsals] = useState<WorshipTeamRehearsal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { guidEquipe } = useParams<{ guid: string }>(); // worshipTeam guid

  useEffect(() => {
    if (!guidEquipe) return;

    apiClient
      .get(`/WorshipTeamRehearsal/team/${guidEquipe}`)
      .then((res) => setRehearsals(res.data))
      .catch(() => showErrorToast("Erro ao carregar ensaios do grupo de louvor."))
      .finally(() => setLoading(false));
  }, [guidEquipe]);

  const handleEditar = (r: WorshipTeamRehearsal) => {
    navigate(`/grupos-de-louvor/${guidEquipe}/ensaios/${r.guid}/editar`);
  };

  const handleExcluir = async (r: WorshipTeamRehearsal) => {
    try {
      await apiClient.delete(`/WorshipTeamRehearsal/${r.guid}`);
      showDeletedToast();
      setRehearsals((prev) => prev.filter((x) => x.guid !== r.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar ensaio: " + error);
    }
  };

  const columns = [
    {
      key: "rehearsalDate",
      label: "Data do Ensaio",
      render: (r: WorshipTeamRehearsal) =>
        new Date(r.rehearsalDate).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (r: WorshipTeamRehearsal) => (
        <Badge
          size="sm"
          color={
            r.status.toLowerCase() === "agendado"
              ? "warning"
              : r.status.toLowerCase() === "realizado"
              ? "success"
              : "error"
          }
        >
          {r.status}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (r: WorshipTeamRehearsal) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(r)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(r)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredRehearsals = rehearsals.filter((r) => {
    if (!filterStatus) return true;
    return r.status.toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta
        title="Ensaios do Grupo de Louvor"
        description="Lista de ensaios agendados e realizados"
      />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Grupos de Louvor", path: "/grupos-de-louvor" },
          { label: "Ensaios", path: `/grupos-de-louvor/${guidEquipe}/ensaios` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Ensaios do Grupo de Louvor">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Voltar
              </Button>
              <Button onClick={() => navigate(`/grupos-de-louvor/${guidEquipe}/ensaios/criar`)}>
                Novo Ensaio
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

          {rehearsals.length > 0 ? (
            <GenericTable columns={columns} data={filteredRehearsals} />
          ) : (
            <NoData />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
