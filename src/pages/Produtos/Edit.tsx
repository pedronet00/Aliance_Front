import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormProduto, { ProdutoDTO } from "../Forms/FormProduto";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";

export default function ProdutosEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<ProdutoDTO | null>(null);

  useEffect(() => {
    apiClient.get(`/Produto/${id}`).then((res) => {
      setProduto(res.data);
    });
  }, [id]);

  const handleSubmit = async (data: ProdutoDTO) => {
    await apiClient.put(`/Produto/${id}`, data);
    showEditedSuccessfullyToast();
    navigate("/produtos");
  };

  if (!produto) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Editar produto</h1>
      <FormProduto initialData={produto} onSubmit={handleSubmit} />
    </div>
  );
}
