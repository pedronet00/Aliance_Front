import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormMissionCampaign, { MissionCampaignFormData } from "../Forms/FormMissionCampaign";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function MissionCampaignEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<MissionCampaignFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/MissionCampaign/${guid}`).then((res) => {
      setCampaign(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: MissionCampaignFormData) => {
    await apiClient.put(`/MissionCampaign`, data);
    showEditedSuccessfullyToast();
    navigate("/campanhas-de-missoes");
  };

   if (!campaign) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Campanha" description="Editar Campanha" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Campanhas de Missões", path: "/campanhas-de-missoes" },
            { label: "Editar Campanha", path: `/campanhas-de-missoes/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormMissionCampaign initialData={campaign} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
