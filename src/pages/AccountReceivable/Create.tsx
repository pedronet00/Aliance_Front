import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormAccountReceivable, {AccountReceivableFormData} from "../Forms/FormAccountReceivable";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function AccountReceivableCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: AccountReceivableFormData) => {
    await apiClient.post("/AccountReceivable", data);
    showCreatedSuccessfullyToast();
    navigate("/contas-a-receber"); 
  }; 

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Conta a Receber</h1>
      <FormAccountReceivable onSubmit={handleSubmit} />
    </div>
  );
}
