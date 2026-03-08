import apiClient from "@/api/apiClient";
import { Link, useNavigate } from "react-router-dom";
import { showCreatedSuccessfullyToast } from "@/components/toast/Toasts";
import FormUser from "../Forms/FormUser";
import { UserDTO } from "@/types/Usuario/UserDTO";
import Alert from "@/components/ui/alert/Alert";

export default function UsuariosCreate() {
  const navigate = useNavigate();

  const handleSubmit = async (data: UserDTO) => {
    try {
      let payload: FormData | UserDTO = data;
      let headers = {};

      if (data.image) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, value.toString());
            }
          }
        });
        payload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      }

      const response = await apiClient.post("/User", payload, { headers });
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
          clique <Link to="/usuarios/importar" className="underline">aqui</Link>.</>} variant={"info"} />
      </div>
      <h1 className="text-xl font-semibold mb-4">Cadastrar Usuário</h1>
      {/* validacao usuario de outra igreja */}

      <FormUser onSubmit={handleSubmit} />
    </div>
  );
}
