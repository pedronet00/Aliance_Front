import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import FormTithe from "../Forms/FormTithe";
import { TitheDTO } from "@/types/Tithe";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function TitheCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: TitheDTO) => {
    await apiClient.post("/Tithe", data);
    showCreatedSuccessfullyToast();
    navigate("/dizimos");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Registrar Dízimo</h1>
      <FormTithe onSubmit={handleSubmit} />
    </div>
  );
}
