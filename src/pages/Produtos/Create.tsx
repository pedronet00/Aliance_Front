import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormProduto, {ProdutoDTO} from "../Forms/FormProduto";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function ProdutosCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ProdutoDTO) => {
    await apiClient.post("/Produto", data);
    showCreatedSuccessfullyToast();
    navigate("/produtos"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Produto</h1>
      <FormProduto onSubmit={handleSubmit} />
    </div>
  );
}
