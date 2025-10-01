import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Produto } from "@/types/Produto/Produto";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast, showToggleStatusToast } from "@/components/toast/Toasts";

export default function ProdutosList() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Produto")
      .then((res) => setProdutos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, []);

  const handleEditar = (u: Produto) => {
    navigate(`/produtos/editar/${u.id}`)
  };

  const handleExcluir = async (u: Produto) => {
    try {
      await apiClient.delete(`/Produto/${u.id}`);
      showDeletedToast();
      setProdutos((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      showErrorToast();
    }
  };

  const handleAtivarDesativar = async (u: Produto) => {
    try {
      var endpoint = u.status == true ? 'deactivate' : 'activate';
      await apiClient.patch(`/Produto/${endpoint}/${u.id}`, {
        status: !u.status, 
      });
      showToggleStatusToast();
      setProdutos((prev) =>
        prev.map((c) =>
          c.id === u.id ? { ...c, status: !c.status } : c
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do produto:", error);
      alert("Erro ao atualizar status do produto.");
    }
  };

  const columns = [
    { key: "nome" },
    { key: "descricao" },
    { label: "preço", key: "preco" },
    { label: "estoque", key: "quantidadeEstoque" },
    {
      key: "status",
      label: "Status",
      render: (c: Produto) =>
        c.status
          ? <span className="text-green-600">Ativo</span>
          : <span className="text-red-600">Inativo</span>
    },
    {
    label: "Ações",
    render: (u: Produto) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreDotIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => handleEditar(u)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleAtivarDesativar(u)}>
            {u.status ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleExcluir(u)}
            className="text-destructive focus:text-destructive"
          >
            <span>Excluir</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ]

  if (loading) return <p>Carregando...</p>

  return (
    <>
      <PageMeta title="Produtos" description="Lista de Produtos" />
      <PageBreadcrumb pageTitle="Produtos" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Produtos">
          <Button 
          onClick={() => window.location.href = '/produtos/criar'} 
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Novo Produto
          </Button>
          <GenericTable columns={columns} data={produtos} />
        </ComponentCard>
      </div>
    </>
  );
}
