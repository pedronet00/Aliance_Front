import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import FormDepartmentMember, { DepartmentMemberFormData } from "../Forms/FormDepartmentMember";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function DepartmentMemberCreate() {
  const navigate = useNavigate();
  const { departmentGuid } = useParams(); // obtém guid da célula via rota

  const handleSubmit = async (data: DepartmentMemberFormData) => {
    if (!departmentGuid || !data.memberGuid) return;

    await apiClient.post(`/DepartmentMember/${departmentGuid}/member/${data.memberGuid}`);
    showCreatedSuccessfullyToast();
    navigate(`/departamentos/${departmentGuid}/membros`); // volta para tela de membros da célula
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar membro do departamento</h1>
      <FormDepartmentMember onSubmit={handleSubmit} />
    </div>
  );
}
