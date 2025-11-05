import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormMissionCampaign, {MissionCampaignFormData} from "../Forms/FormMissionCampaign";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function MissionCampaignCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: MissionCampaignFormData) => {
    await apiClient.post("/MissionCampaign", data);
    showCreatedSuccessfullyToast();
    navigate("/campanhas-de-missoes"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Campanha de Missões</h1>
      <FormMissionCampaign onSubmit={handleSubmit} />
    </div>
  );
}
