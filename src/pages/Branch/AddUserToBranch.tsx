import { useNavigate } from "react-router-dom";
import FormAddUserToBranch from "../Forms/FormAddUserToBranch";

export default function BranchMemberCreate() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Adicionar membro à Filial</h1>
      <FormAddUserToBranch />
    </div>
  );
}
