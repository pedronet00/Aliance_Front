import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import FormMissionCampaignDonation from "../Forms/FormMissionCampaignDonation";
import { MissionCampaignDonationDTO } from "@/types/Tithe";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function MissionCampaignDonationCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: MissionCampaignDonationDTO) => {
    await apiClient.post("/MissionCampaignDonation", data);
    showCreatedSuccessfullyToast();
    navigate("/campanhas-de-missoes");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Registrar Doação em Campanha</h1>
      <FormMissionCampaignDonation onSubmit={handleSubmit} />
    </div>
  );
}
