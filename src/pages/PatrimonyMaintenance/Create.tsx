import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormPatrimonyMaintenance, {PatrimonyMaintenanceFormData} from "../Forms/FormPatrimonyMaintenance";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function PatrimonyMaintenanceCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PatrimonyMaintenanceFormData) => {
    await apiClient.post("/PatrimonyMaintenance", data);
    showCreatedSuccessfullyToast();
    navigate("/manutencoes-patrimonios"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Manutenção de Patrimônio</h1>
      <FormPatrimonyMaintenance onSubmit={handleSubmit} />
    </div>
  );
}
