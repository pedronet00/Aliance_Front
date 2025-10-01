import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCostCenter, {CostCenterFormData} from "../Forms/FormCostCenter";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function CostCenterCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CostCenterFormData) => {
    await apiClient.post("/CostCenter", data);
    showCreatedSuccessfullyToast();
    navigate("/centros-de-custo"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Centro de Custo</h1>
      <FormCostCenter onSubmit={handleSubmit} />
    </div>
  );
}
