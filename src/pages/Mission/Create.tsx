import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormMission from "../Forms/FormMission";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function MissionCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    await apiClient.post("/Mission", data);
    showCreatedSuccessfullyToast();
    navigate("/missoes");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Missão</h1>
      <FormMission onSubmit={handleSubmit} />
    </div>
  );
}
