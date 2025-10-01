import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";
import FormUsuario, {UsuarioDTO} from "../Forms/FormUsuario";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";

export default function UsuariosCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: UsuarioDTO) => {
    await apiClient.post("/Usuario", data);
    showCreatedSuccessfullyToast();
    navigate("/usuarios"); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Cadastrar Usuário</h1>
      <FormUsuario onSubmit={handleSubmit} />
    </div>
  );
}
