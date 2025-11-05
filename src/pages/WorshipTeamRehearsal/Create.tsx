import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormWorshipTeamRehearsal, {
  WorshipTeamRehearsalDTO,
} from "../Forms/FormWorshipTeamRehearsal";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function WorshipTeamRehearsalCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: WorshipTeamRehearsalDTO) => {
    await apiClient.post("/WorshipTeamRehearsal", data);
    showCreatedSuccessfullyToast();
    navigate(-1); // redireciona após salvar
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Ensaio de Louvor</h1>
      <FormWorshipTeamRehearsal onSubmit={handleSubmit} />
    </div>
  );
}
