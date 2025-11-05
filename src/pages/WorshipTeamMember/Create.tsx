import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import FormWorshipTeamMember, { WorshipTeamMemberFormData } from "../Forms/FormWorshipTeamMember";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";

export default function WorshipTeamMemberCreate() {
  const navigate = useNavigate();
  const { teamGuid } = useParams();

  const handleSubmit = async (data: WorshipTeamMemberFormData) => {
    if (!teamGuid || !data.userId) return;

    try {
      const response = await apiClient.post(`/WorshipTeamMember/${teamGuid}/member/${data.userId}`);

      const result = response.data; // axios guarda o JSON em `data`

      if (result?.hasNotifications && result.notifications.length > 0) {
        
        result.notifications.forEach((n: string) => showErrorToast(n));
        return; // não navega, pois houve notificações
      }

      showCreatedSuccessfullyToast();
      navigate(`/grupos-de-louvor/${teamGuid}/membros`);
    } catch (error: any) {
      console.error("Erro ao criar membro:", error);
      showErrorToast("Erro ao cadastrar membro.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar membro do grupo de louvor</h1>
      <FormWorshipTeamMember onSubmit={handleSubmit} />
    </div>
  );
}
