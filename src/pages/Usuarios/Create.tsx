import apiClient from "@/api/apiClient";
import { Link, useNavigate } from "react-router-dom";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";
import FormUser, { UsuarioDTO } from "../Forms/FormUser";
import Alert from "@/components/ui/alert/Alert";

export default function UsuariosCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: UsuarioDTO) => {
    try {
      const response = await apiClient.post("/User", data);
      const result = response.data;

      if (result.hasNotifications && result.notifications?.length > 0) {
        alert("Erro ao criar usuário:\n" + result.notifications.join("\n"));
        return;
      }

      showCreatedSuccessfullyToast();
      navigate("/membros");
    } catch (error: any) {
      console.error("Erro na requisição:", error);
      alert("Falha ao criar usuário. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Alert title="Usuário de outra igreja?" message={<>Para cadastrar um usuário que já era de outra igreja utilizadora do Aliance,  
      clique <Link to="/usuarios/importar" className="underline">aqui</Link>.</>} variant={"info"}/>
      </div>
      <h1 className="text-xl font-semibold mb-4">Cadastrar Usuário</h1>
      {/* validacao usuario de outra igreja */}

      <FormUser onSubmit={handleSubmit} />
    </div>
  );
}
