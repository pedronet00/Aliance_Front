import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormBudget, {BudgetFormData} from "../Forms/FormBudget";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function BudgetCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: BudgetFormData) => {
    await apiClient.post("/Budget", data);
    showCreatedSuccessfullyToast();
    navigate("/orcamentos"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Orçamento</h1>
      <FormBudget onSubmit={handleSubmit} />
    </div>
  );
}
