import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormCell, {CellFormData} from "../Forms/FormCell";
import { showCreatedSuccessfullyToast, showInfoToast } from "@/components/toast/Toasts";
import { useAuth } from "@/context/AuthContext";

export default function CellCreate() {
  const navigate = useNavigate();
  const {user} = useAuth();
  
  if(user?.totalLocations == 0){
    showInfoToast("Você ainda não tem locais cadastrados. Cadastre um local antes de criar uma célula.");
  }

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
