import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormFornecedor, { FornecedorFormData } from "../Forms/FormFornecedor";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";

export default function FornecedoresEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fornecedor, setFornecedor] = useState<FornecedorFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Fornecedores/${id}`).then((res) => {
      setFornecedor(res.data.result);
    });
  }, [id]);

  const handleSubmit = async (data: FornecedorFormData) => {
    await apiClient.put(`/Fornecedores/${id}`, data);
    showEditedSuccessfullyToast();
    navigate("/fornecedores");
  };

  if (!fornecedor) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar Fornecedor</h1>
      <FormFornecedor initialData={fornecedor} onSubmit={handleSubmit} />
    </div>
  );
}
