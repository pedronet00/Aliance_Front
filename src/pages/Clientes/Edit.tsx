import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormCliente, { ClienteFormData } from "../Forms/FormCliente";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";

export default function ClientesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<ClienteFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Clientes/${id}`).then((res) => {
      setCliente(res.data.result);
    });
  }, [id]);

  const handleSubmit = async (data: ClienteFormData) => {
    await apiClient.put(`/Clientes/${id}`, data);
    showEditedSuccessfullyToast();
    navigate("/clientes");
  };

  if (!cliente) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar Cliente</h1>
      <FormCliente initialData={cliente} onSubmit={handleSubmit} />
    </div>
  );
}
