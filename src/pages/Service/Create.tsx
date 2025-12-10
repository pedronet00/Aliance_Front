import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormService, {ServiceFormData} from "../Forms/FormService";
import { showCreatedSuccessfullyToast, showErrorToast, showInfoToast } from "@/components/toast/Toasts";
import { useAuth } from "@/context/AuthContext";

export default function ServiceCreate() {
  const navigate = useNavigate();
  const {user} = useAuth();
  
    if(user?.totalLocations == 0){
      showInfoToast("Você ainda não tem locais cadastrados. Cadastre um local antes de criar um culto.");
    }

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
