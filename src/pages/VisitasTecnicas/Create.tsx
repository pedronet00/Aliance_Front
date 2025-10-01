import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormVisitaTecnica, {VisitaTecnicaDTO} from "../Forms/FormVisitaTecnica";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function VisitasCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: VisitaTecnicaDTO) => {
    await apiClient.post("/VisitasTecnicas", data);
    showCreatedSuccessfullyToast();
    navigate("/visitas"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Visita</h1>
      <FormVisitaTecnica onSubmit={handleSubmit} />
    </div>
  );
}
