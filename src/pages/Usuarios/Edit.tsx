import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { showEditedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";
import { UserDTO } from "@/types/Usuario/UserDTO";
import FormUser from "../Forms/FormUser";
import NoData from "@/components/no-data";
import Error from "../OtherPage/Error";

export default function UsuariosEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<UserDTO | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    apiClient.get(`/User/GetById/${id}`)
      .then((res) => {
        const { result, hasNotifications, notifications } = res.data;

        if (hasNotifications) {
          setHasNotifications(true);
          setNotifications(notifications || []);
          return;
        }

        setUsuario(result);
      })
      .catch(() => {
        setHasNotifications(true);
        setNotifications(["Erro ao carregar usuário."]);
      });
  }, [id]);

  const handleSubmit = async (data: UserDTO) => {
    await apiClient.put(`/User`, data);
    showEditedSuccessfullyToast();
    navigate("/membros");
  };

  if (hasNotifications) {
    return <Error/>;
  }

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar usuário</h1>
      <FormUser initialData={usuario} onSubmit={handleSubmit} />
    </div>
  );
}
