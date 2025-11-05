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
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { Button } from "@/components/ui/button";
import { MissionCampaignDonation } from "@/types/MissionCampaignDonation/MissionCampaignDonation";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import NoData from "@/components/no-data";
import { useParams } from "react-router";

export default function MissionCampaignDonationList() {
  const [donations, setDonations] = useState<MissionCampaignDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const {campaignGuid} = useParams<{campaignGuid: string}>();

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    carregarDizimos(currentPage);
  }, [currentPage]);

  const carregarDizimos = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/MissionCampaignDonation/campaign/paged/${campaignGuid}?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data;

      setDonations(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      showErrorToast("Erro ao carregar doações: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (t: MissionCampaignDonation) => {
    window.location.href = `/dizimos/editar/${t.guid}`;
  };

  const handleExcluir = async (t: MissionCampaignDonation) => {
    try {
      await apiClient.delete(`/MissionCampaignDonation/${t.guid}`);
      showDeletedToast();
      carregarDizimos(currentPage);
    } catch (error) {
      showErrorToast("Erro ao excluir dízimo: " + error);
    }
  };

  const columns = [
    { label: "Membro", key: "userName" },
    {
      label: "Valor",
      key: "amount",
      render: (t: MissionCampaignDonation) => `R$ ${t.amount.value.toFixed(2)}`,
    },
    {
      label: "Ações",
      render: (t: MissionCampaignDonation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(t)}>
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(t)}
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

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Doações para Campanha de Missões" description="Lista de Doações" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Campanha de Missões", path: "/campanhas-de-missoes" },
          { label: "Doações para Campanha de Missões", path: `/campanhas-de-missoes/${campaignGuid}/doacoes` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Dízimos">
          <Button
            onClick={() => (window.location.href = `/campanhas-de-missoes/${campaignGuid}/doacoes/criar`)}
            className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Registrar doação
          </Button>

          {donations.length > 0 ? (
            <>
              <GenericTable columns={columns} data={donations} />

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
