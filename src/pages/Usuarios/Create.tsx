import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";
import FormUser, {UsuarioDTO}  from "../Forms/FormUser";

export default function UsuariosCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: UsuarioDTO) => {
    await apiClient.post("/User", data);
    showCreatedSuccessfullyToast();
    navigate("/membros"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Usuário</h1>
      <FormUser onSubmit={handleSubmit} />
    </div>
  );
}
