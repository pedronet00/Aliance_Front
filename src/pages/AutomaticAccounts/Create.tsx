import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormAutomaticAccounts from "../Forms/FormAutomaticAccounts";
import { showCreatedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";
import { AutomaticAccountsDTO } from "@/types/AutomaticAccounts/AutomaticAccountsDTO";

export default function AutomaticAccountsCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: AutomaticAccountsDTO) => {
    try {
      await apiClient.post("/AutomaticAccounts", data);
      showCreatedSuccessfullyToast();
      navigate("/contas-automaticas");
    } catch (error: any) {
      // Normalmente sua API retorna array de notifications:
      const msg = error.response?.data?.[0] ?? "Erro ao salvar conta automática.";
      showErrorToast(msg);
    }

  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Conta Automática</h1>
      <FormAutomaticAccounts onSubmit={handleSubmit} />
    </div>
  );
}
