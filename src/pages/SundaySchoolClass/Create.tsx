import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormSundaySchoolClass, { SundaySchoolClassFormData } from "../Forms/FormSundaySchoolClass";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function SundaySchoolClassCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: SundaySchoolClassFormData) => {
    await apiClient.post("/SundaySchoolClass", data);
    showCreatedSuccessfullyToast();
    navigate("/aulas-ebd");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Aula de EBD</h1>
      <FormSundaySchoolClass onSubmit={handleSubmit} />
    </div>
  );
}
