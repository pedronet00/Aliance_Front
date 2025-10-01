import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCliente, {ClienteFormData} from "../Forms/FormCliente";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";

export default function ClientesCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ClienteFormData) => {
    var response = await apiClient.post("/Clientes", data);
    const dados = response.data;
    
    if (dados.hasNotifications && !dados.hasResult) {
    dados.notifications.forEach(notification => {
        showErrorToast(notification);
    });
    return;
}

    showCreatedSuccessfullyToast();
    navigate("/clientes"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Cliente</h1>
      <FormCliente onSubmit={handleSubmit} />
    </div>
  );
}
