import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormDepartment, {DepartmentFormData} from "../Forms/FormDepartment";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function DepartmentCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: DepartmentFormData) => {
    await apiClient.post("/Department", data);
    showCreatedSuccessfullyToast();
    navigate("/departamentos"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Departamento</h1>
      <FormDepartment onSubmit={handleSubmit} />
    </div>
  );
}
