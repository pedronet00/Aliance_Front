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
import { useNavigate, useParams } from "react-router-dom";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { CellMeeting } from "@/types/Cell/CellMeeting";
import NoData from "@/components/no-data";

export default function CellMeetingList() {
  const [meetings, setMeetings] = useState<CellMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterTheme, setFilterTheme] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();
  const { guid } = useParams<{ guid: string }>(); // pega o guid da célula na URL

  useEffect(() => {
    if (!guid) return;
    apiClient
      .get(`/CellMeeting/cell/${guid}`)
      .then((res) => setMeetings(res.data))
      .catch((err) => {
        console.error(err);
        showErrorToast("Erro ao carregar encontros da célula.");
      })
      .finally(() => setLoading(false));
  }, [guid]);

  const handleEditar = (m: CellMeeting) => {
    navigate(`/celulas/${guid}/encontros/${m.guid}/editar`);
  };

  const handleGenerateAccountPayable = (m: CellMeeting) => {
    navigate(`/financeiro/saidas/criar?celula=${guid}&data=${m.date}`);
  };

  const handleExcluir = async (m: CellMeeting) => {
    try {
      await apiClient.delete(`/CellMeeting/${m.guid}`);
      showDeletedToast();
      setMeetings((prev) => prev.filter((x) => x.guid !== m.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar encontro: " + error);
    }
  };

  const columns = [
    { key: "locationName", label: "Local" },
    { key: "leaderName", label: "Responsável" },
    { key: "theme", label: "Tema" },
    {
      key: "date",
      label: "Data",
      render: (m: CellMeeting) =>
        new Date(m.date).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (m: CellMeeting) => (
        <Badge
          size="sm"
          color={
            m.status.toLowerCase() === "agendado"
              ? "warning"
              : m.status.toLowerCase() === "realizado"
              ? "success"
              : "error"
          }
        >
          {m.status}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: CellMeeting) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(m)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleGenerateAccountPayable(m)}>
              Lanche pós-encontro
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(m)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredMeetings = meetings.filter((m) => {
    const themeMatch = m.theme
      .toLowerCase()
      .includes(filterTheme.toLowerCase());
    const statusMatch =
      !filterStatus ||
      m.status.toLowerCase() === filterStatus.toLowerCase();
    return themeMatch && statusMatch;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Encontros de Célula" description="Lista de encontros" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Células", path: "/celulas" },
          { label: "Encontros da Célula", path: `/celulas/${guid}/encontros` },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Encontros">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button variant={"secondary"} onClick={() => navigate(-1)}>Voltar</Button>
              <Button
                onClick={() =>
                  navigate(`/celulas/${guid}/encontros/criar`)
                }
              >
                Novo Encontro
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
                  placeholder="Filtrar por tema"
                  value={filterTheme}
                  onChange={(e) => setFilterTheme(e.target.value)}
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
          {meetings && meetings.length > 0 ? <GenericTable columns={columns} data={filteredMeetings} /> : <NoData/>}
          </ComponentCard>
      </div>
    </>
  );
}
