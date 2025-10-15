import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormEvent, {EventFormData} from "../Forms/FormEvent";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function EventCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: EventFormData) => {
    await apiClient.post("/Event", data);
    showCreatedSuccessfullyToast();
    navigate("/eventos"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Evento</h1>
      <FormEvent onSubmit={handleSubmit} />
    </div>
  );
}
