import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormEvent, { EventFormData } from "../Forms/FormEvent";
import { showCreatedSuccessfullyToast, showErrorToast, showInfoToast } from "@/components/toast/Toasts";
import { useAuth } from "@/context/AuthContext";
import Alert from "@/components/ui/alert/Alert";

export default function EventCreate() {
  const navigate = useNavigate();
  const {user} = useAuth();

  if(user?.totalLocations == 0){
    showInfoToast("Você ainda não tem locais cadastrados. Cadastre um local antes de criar um evento.");
  }

  const handleSubmit = async (data: EventFormData) => {
    try {
      const response = await apiClient.post("/Event", data);
      const result = response.data;

      // Se veio notification do domínio (ex: Money inválido)
      if (result.hasNotifications && result.notifications?.length) {
        result.notifications.forEach((msg: string) => showErrorToast(msg));
        return;
      }

      showCreatedSuccessfullyToast();
      navigate("/eventos");
    } catch (error: any) {
      // Tratamento padrão de erro de API
      const messages =
        error?.response?.data?.notifications ??
        error?.response?.data ??
        ["Ocorreu um erro inesperado."];

      if (Array.isArray(messages)) {
        messages.forEach((msg: string) => showErrorToast(msg));
      } else {
        showErrorToast(messages);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Evento</h1>
      <FormEvent onSubmit={handleSubmit} />
    </div>
  );
}
