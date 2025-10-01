import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { showDeletedToast, showErrorToast, showToggleStatusToast } from "@/components/toast/Toasts";
import { Venda } from "@/types/Venda/Venda";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";

export default function VendasList() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Vendas")
      .then((res) => setVendas(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, []);

  const handleEditar = (u: Venda) => {
    navigate(`/clientes/editar/${u.id}`)
  };

  const handleExcluir = async (u: Venda) => {
    try {
      await apiClient.delete(`/Vendas/${u.id}`);
      showDeletedToast();
      setVendas((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
      showErrorToast();
    }
  };

  const statusMap: Record<string, { text: string; color: "success" | "error" | "warning" }> = {
    Pendente:   { text: "Pendente", color: "warning" },
    Concluida:  { text: "Finalizada",           color: "success" },
    Cancelada:  { text: "Cancelada",            color: "error" },
  };

  const columns = [
    { key: "guid" },
    { label: "Cliente", key: "nomeCliente" },
    { label: "Data", key: "dataVenda" },
    { label: "Valor Original", key: "valorOriginal" },
    { label: "Desconto (%)", key: "descontoPercentual" },
    { label: "Valor total", key: "valorTotal" },
    { key: "empresaId" },
    {
      key: "status",
      label: "Status",
      render: (c: Venda) => {
        const status = statusMap[c.status] ?? { text: "Desconhecido", color: "dark" };
        return (
          <Badge variant="light" size="sm" color={status.color}>
            {status.text}
          </Badge>
        );
      }
    },
    {
    label: "Ações",
    render: (u: Venda) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreDotIcon />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          {u.status != 'Finalizada' && u.status != 'Cancelada' && (
          <DropdownMenuItem onClick={() => handleEditar(u)}>
            Editar
          </DropdownMenuItem>
          )}
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
      <PageMeta title="Vendas" description="Lista de Vendas" />
      <PageBreadcrumb pageTitle="Vendas" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Vendas">
          <Button 
          onClick={() => window.location.href = '/vendas/criar'} 
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Nova Venda
          </Button>
          <GenericTable columns={columns} data={vendas} />
        </ComponentCard>
      </div>
    </>
  );
}
