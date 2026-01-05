import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Button } from "@/components/ui/button";
import NoData from "@/components/no-data";
import { showErrorToast } from "@/components/toast/Toasts";
import { RehearsalPresence } from "@/types/Presence/RehearsalPresence";

export default function WorshipTeamRehearsalPresences() {
  const { guidEquipe, rehearsalGuid } = useParams<{
    guidEquipe: string;
    rehearsalGuid: string;
  }>();

  const navigate = useNavigate();

  const [presences, setPresences] = useState<RehearsalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPresences = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Presence/rehearsal/by-rehearsal/${rehearsalGuid}`
      );
      setPresences(res.data.result?.items || []);
    } catch (err) {
      showErrorToast("Erro ao carregar presenças do ensaio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresences();
  }, [rehearsalGuid]);

  const columns = [
    { key: "userName", label: "Membro" },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Presenças do Ensaio" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Grupos de Louvor", path: "/grupos-de-louvor" },
          {
            label: "Ensaios",
            path: `/grupos-de-louvor/${guidEquipe}/ensaios`,
          },
          { label: "Presenças" },
        ]}
      />

      <ComponentCard title="Presenças do Ensaio">
        <div className="flex justify-between mb-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
            <Button 
            onClick={() =>
              navigate(
                `/grupos-de-louvor/${guidEquipe}/ensaios/${rehearsalGuid}/presencas/adicionar`
              )
            }
          >
            Adicionar
          </Button>

        </div>

        {presences.length > 0 ? (
          <GenericTable columns={columns} data={presences} />
        ) : (
          <NoData />
        )}
      </ComponentCard>
    </>
  );
}
