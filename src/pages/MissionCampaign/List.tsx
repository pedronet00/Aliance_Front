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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import {
  showDeletedToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import NoData from "@/components/no-data";
import { MissionCampaign } from "@/types/Mission/MissionCampaign";
import { useAuth } from "@/context/AuthContext";

export default function MissionCampaignList() {
  const [campaigns, setCampaigns] = useState<MissionCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const {can} = useAuth();

  const navigate = useNavigate();

  const fetchCampaigns = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/MissionCampaign/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data;

      setCampaigns(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar campanhas missionárias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(currentPage);
  }, [currentPage]);

  const handleEditar = (c: MissionCampaign) => {
    navigate(`/campanhas-de-missoes/editar/${c.guid}`);
  };

  const handleDonation = (c: MissionCampaign) => {
    navigate(`/campanhas-de-missoes/${c.guid}/doacoes`);
  };

  const handleExcluir = async (c: MissionCampaign) => {
    try {
      await apiClient.delete(`/MissionCampaign/${c.guid}`);
      showDeletedToast();
      fetchCampaigns(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar campanha: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "type", label: "Tipo" },
    {
      key: "startDate",
      label: "Início",
      render: (c: MissionCampaign) =>
        new Date(c.startDate).toLocaleDateString("pt-BR"),
    },
    {
      key: "endDate",
      label: "Término",
      render: (c: MissionCampaign) =>
        new Date(c.endDate).toLocaleDateString("pt-BR"),
    },
    {
      key: "targetAmount",
      label: "Meta",
      render: (c: MissionCampaign) => `R$ ${c.targetAmount.toFixed(2)}`,
    },
    {
      key: "collectedAmount",
      label: "Arrecadado",
      render: (c: MissionCampaign) => `R$ ${c.collectedAmount.toFixed(2)}`,
    },
    {
      label: "Ações",
      render: (c: MissionCampaign) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>
          {can(["Admin", "Pastor", "Financeiro","Secretaria"]) && (
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(c)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDonation(c)}>
              Ver doações
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(c)}
              className="text-destructive focus:text-destructive"
            >
              <span>Excluir</span>
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
          )}
        </DropdownMenu>
      ),
    },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    return (
      c.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterType ? c.type === filterType : true)
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta
        title="Campanhas de Missões"
        description="Lista de Campanhas de Missões"
      />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Campanhas de Missões", path: "/missoes/campanhas" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Campanhas de Missões">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              {can(["Admin", "Pastor", "Financeiro","Secretaria"]) && (
              <Button onClick={() => navigate("/campanhas-de-missoes/criar")}>
                Nova Campanha
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
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os tipos</option>
                  <option value="Municipal">Municipal</option>
                  <option value="Regional">Regional</option>
                  <option value="Estadual">Estadual</option>
                  <option value="Nacional">Nacional</option>
                  <option value="Mundial">Mundial</option>
                </select>
              </div>
            )}
          </div>

          {filteredCampaigns.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredCampaigns} />

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
