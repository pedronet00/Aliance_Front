import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormLocation, {LocationFormData} from "../Forms/FormLocation";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function LocationCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: LocationFormData) => {
    await apiClient.post("/Location", data);
    showCreatedSuccessfullyToast();
    navigate("/locais"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Local</h1>
      <FormLocation onSubmit={handleSubmit} />
    </div>
  );
}
