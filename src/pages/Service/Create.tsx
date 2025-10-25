import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormService, {ServiceFormData} from "../Forms/FormService";
import { ServiceDTO } from "@/types/Service/ServiceDTO";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";

export default function ServiceCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ServiceFormData) => {
    var response = await apiClient.post("/Service", data);
    const dados = response.data;
    if (dados.hasNotifications && !dados.hasResult) {
        dados.notifications.forEach(notification => {
            showErrorToast(notification);
        });
      return;
    }
    showCreatedSuccessfullyToast();
    navigate("/cultos");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Culto</h1>
      <FormService onSubmit={handleSubmit} />
    </div>
  );
}
