import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormIncome, {IncomeFormData} from "../Forms/FormIncome";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function IncomeCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: IncomeFormData) => {
    await apiClient.post("/Income", data);
    showCreatedSuccessfullyToast();
    navigate("/financeiro/entradas"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar entrada financeira</h1>
      <FormIncome onSubmit={handleSubmit} />
    </div>
  );
}
