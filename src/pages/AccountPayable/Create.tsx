import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormAccountPayable, {AccountPayableFormData} from "../Forms/FormAccountPayable";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function AccountPayableCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: AccountPayableFormData) => {
    await apiClient.post("/AccountPayable", data);
    showCreatedSuccessfullyToast();
    navigate("/contas-a-pagar"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Conta a Pagar</h1>
      <FormAccountPayable onSubmit={handleSubmit} />
    </div>
  );
}
