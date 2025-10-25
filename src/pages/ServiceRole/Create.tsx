import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormServiceRole, {ServiceRoleFormData} from "../Forms/FormServiceRole";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";

export default function ServiceRoleCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ServiceRoleFormData) => {
    var response = await apiClient.post("/ServiceRole", data);
    const dados = response.data;
    if (dados.hasNotifications && !dados.hasResult) {
        dados.notifications.forEach(notification => {
            showErrorToast(notification);
        });
      return;
    }
    showCreatedSuccessfullyToast();
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Escala do Culto</h1>
      <FormServiceRole onSubmit={handleSubmit} />
    </div>
  );
}
