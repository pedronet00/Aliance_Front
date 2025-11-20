import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormSundaySchoolClassroom, {SundaySchoolClassroomFormData} from "../Forms/FormSundaySchoolClassroom";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function SundaySchoolClassroomCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: SundaySchoolClassroomFormData) => {
    await apiClient.post("/SundaySchoolClassroom", data);
    showCreatedSuccessfullyToast();
    navigate("/classes-ebd"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Classe de EBD</h1>
      <FormSundaySchoolClassroom onSubmit={handleSubmit} />
    </div>
  );
}
