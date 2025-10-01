import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormFornecedor, {FornecedorFormData} from "../Forms/FormFornecedor";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function FornecedoresCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: FornecedorFormData) => {
    await apiClient.post("/Fornecedores", data);
    showCreatedSuccessfullyToast();
    navigate("/fornecedores"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Orçamento</h1>
      <FormFornecedor onSubmit={handleSubmit} />
    </div>
  );
}
