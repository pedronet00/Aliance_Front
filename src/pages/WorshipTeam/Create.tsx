import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormWorshipTeam, {WorshipTeamFormData} from "../Forms/FormWorshipTeam";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function WorshipTeamCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: WorshipTeamFormData) => {
    await apiClient.post("/WorshipTeam", data);
    showCreatedSuccessfullyToast();
    navigate("/grupos-de-louvor"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Grupo de Louvor</h1>
      <FormWorshipTeam onSubmit={handleSubmit} />
    </div>
  );
}
