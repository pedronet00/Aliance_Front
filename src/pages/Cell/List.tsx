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
import { Cell } from "@/types/Cell/Cell";
import NoData from "@/components/no-data";
import Error from "../OtherPage/Error";
import { useAuth } from "@/context/AuthContext";

export default function CellList() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const {can} = useAuth();
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const fetchCells = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Cell/paged?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data;
      setCells(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);

      if (currentPage !== data.currentPage) {
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      showErrorToast("Erro ao carregar células");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCells(1);
  }, []);

  const handleEditar = (u: Cell) => {
    navigate(`/celulas/editar/${u.guid}`);
  };

  const handleExcluir = async (u: Cell) => {
    try {
      await apiClient.delete(`/Cell/${u.guid}`);
      showDeletedToast();
      setCells((prev) => prev.filter((c) => c.guid !== u.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar célula: " + error);
    }
  };

  const weekdayMap: Record<string, string> = {
    Domingo: "Domingo",
    SegundaFeira: "Segunda-feira",
    TercaFeira: "Terça-feira",
    QuartaFeira: "Quarta-feira",
    QuintaFeira: "Quinta-feira",
    SextaFeira: "Sexta-feira",
    Sabado: "Sábado"
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "locationName", label: "Local" },
    { key: "leaderName", label: "Líder" },
    { key: "meetingDay", label: "Dia de reunião",render: (u: Cell) => weekdayMap[u.meetingDay] || u.meetingDay},
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
            <DropdownMenuItem onClick={() => navigate(`/celulas/${u.guid}/membros`)}>
              Ver membros 
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/celulas/${u.guid}/encontros`)}>
              Ver encontros 
            </DropdownMenuItem>
            {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
            <>
            <DropdownMenuItem onClick={() => handleEditar(u)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExcluir(u)} className="text-destructive focus:text-destructive">
              Excluir
            </DropdownMenuItem>
            </>
            )}
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

  if(error) return <Error/>;

  return (
    <>
      <PageMeta title="Células" description="Lista de Células" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Células", path: "/celulas" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Células">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
              <Button
                onClick={() => (window.location.href = "/celulas/criar")}
              >
                Nova célula
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

          {celulasFiltradas.length > 0 ? (
            <>
              <GenericTable columns={columns} data={celulasFiltradas} />

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
