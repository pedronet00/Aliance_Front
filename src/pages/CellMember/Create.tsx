import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import FormCellMember, { CellMemberFormData } from "../Forms/FormCellMember";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function CellMemberCreate() {
  const navigate = useNavigate();
  const { cellGuid } = useParams(); // obtém guid da célula via rota

  const handleSubmit = async (data: CellMemberFormData) => {
    if (!cellGuid || !data.memberGuid) return;

    await apiClient.post(`/CellMember/${cellGuid}/member/${data.memberGuid}`);
    showCreatedSuccessfullyToast();
    navigate(`/celulas/${cellGuid}/membros`); // volta para tela de membros da célula
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar membro da célula</h1>
      <FormCellMember onSubmit={handleSubmit} />
    </div>
  );
}
