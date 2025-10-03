import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormPastoralVisit, {PastoralVisitFormData} from "../Forms/FormPastoralVisit";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";

export default function PastoralVisitCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PastoralVisitFormData) => {
  try {
    const result = await apiClient.post("/PastoralVisit", data);

    showCreatedSuccessfullyToast();
    navigate("/visitas-pastorais");
  } catch (error: any) {
    // Tenta extrair mensagens do backend (DomainNotificationsResult)
    const messages =
      error?.response?.data ?? ["Ocorreu um erro inesperado."];

    // Exibe todas as mensagens (caso venha um array)
    if (Array.isArray(messages)) {
      messages.forEach((msg: string) => showErrorToast(msg));
    } else {
      showErrorToast(messages);
    }
  }
};

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Visita Pastoral</h1>
      <FormPastoralVisit onSubmit={handleSubmit} />
    </div>
  );
}
