import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import FormSundaySchoolClassroomMember, { MemberFormData } from "../Forms/FormSundaySchoolClassroomMember";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function SundaySchoolClassroomMemberCreate() {
  const navigate = useNavigate();
  const { classroomGuid } = useParams(); 

  const handleSubmit = async (data: MemberFormData) => {
    if (!classroomGuid || !data.memberGuid) return;

    await apiClient.post(`/SundaySchoolClassroomMembers/${classroomGuid}/member/${data.memberGuid}`);
    showCreatedSuccessfullyToast();
    navigate(`/classes-ebd/${classroomGuid}/membros`); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar membro da Classe de EBD</h1>
      <FormSundaySchoolClassroomMember onSubmit={handleSubmit} />
    </div>
  );
}
