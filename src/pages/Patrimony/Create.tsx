import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormPatrimony, {PatrimonyFormData} from "../Forms/FormPatrimony";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function PatrimonyCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: PatrimonyFormData) => {
    await apiClient.post("/Patrimony", data);
    showCreatedSuccessfullyToast();
    navigate("/patrimonios"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Patrimônio</h1>
      <FormPatrimony onSubmit={handleSubmit} />
    </div>
  );
}
