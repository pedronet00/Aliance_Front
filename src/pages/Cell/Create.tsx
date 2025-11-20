import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCell, {CellFormData} from "../Forms/FormCell";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function CellCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: CellFormData) => {
    await apiClient.post("/Cell", data);
    showCreatedSuccessfullyToast();
    navigate("/celulas"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar célula</h1>
      <FormCell onSubmit={handleSubmit} />
    </div>
  );
}
