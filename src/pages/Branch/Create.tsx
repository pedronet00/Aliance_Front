import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormBranch from "../Forms/FormBranch";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function BranchCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await apiClient.post("/Branch", data);
    showCreatedSuccessfullyToast();
    navigate("/filiais");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Filial</h1>
      <FormBranch onSubmit={handleSubmit} />
    </div>
  );
}
