import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormUsuario, { UsuarioDTO } from "../Forms/FormUsuario";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";

export default function UsuariosEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);

  useEffect(() => {
    apiClient.get(`/Usuario/${id}`).then((res) => {
      setUsuario(res.data);
    });
  }, [id]);

  const handleSubmit = async (data: UsuarioDTO) => {
    await apiClient.put(`/Usuario/${id}`, data);
    showEditedSuccessfullyToast();
    navigate("/usuarios");
  };

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar usuário</h1>
      <FormUsuario initialData={usuario} onSubmit={handleSubmit} />
    </div>
  );
}
