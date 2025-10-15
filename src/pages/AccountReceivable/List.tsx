import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import {
  showDeletedToast,
  showErrorToast,
  showEditedSuccessfullyToast,
} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import { AccountReceivable } from "@/types/AccountReceivable/AccountReceivable";
import Badge from "@/components/ui/badge/Badge";

export default function AccountReceivableList() {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/AccountReceivable")
      .then((res) => setAccounts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: AccountReceivable) => {
    navigate(`/fornecedores/editar/${u.id}`);
  };

  const handleExcluir = async (u: AccountReceivable) => {
    try {
      await apiClient.delete(`/AccountReceivable/${u.guid}`);
      showDeletedToast();
      setAccounts((prev) => prev.filter((c) => c.guid !== u.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar conta: " + error);
    }
  };

  // --- Novo: mudança de status ---
  const handleToggleStatus = async (account: AccountReceivable, newStatus: string) => {
    try {
      await apiClient.patch(`/AccountReceivable/${account.guid}/status/${newStatus}`);
      showEditedSuccessfullyToast(`Status alterado para ${newStatus}`);
      setAccounts((prev) =>
        prev.map((c) =>
          c.guid === account.guid ? { ...c, accountStatus: newStatus } : c
        )
      );
    } catch (error) {
      showErrorToast("Erro ao alterar status: " + error);
    }
  };

  const columns = [
    { key: "description", label: "Descrição" },
    { key: "dueDate", label: "Data de vencimento" },
    { key: "amount", label: "Valor" },
    { key: "paymentDate", label: "Data de pagamento" },
    { key: "costCenterName", label: "Centro de Custo" },
    {
      key: "accountStatus",
      label: "Status",
      render: (c: AccountReceivable) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          Pendente: { color: "warning", label: "Pendente" },
          Paga: { color: "success", label: "Paga" },
          Atrasada: { color: "error", label: "Atrasada" },
          Parcial: { color: "info", label: "Parcial" },
          Cancelada: { color: "secondary", label: "Cancelada" },
        };

        const status = statusMap[c.accountStatus] ?? {
          color: "default",
          label: c.accountStatus,
        };

        return (
          <Badge size="sm" color={status.color}>
            {status.label}
          </Badge>
        );
      },
    },
    {
      label: "Ações",
      render: (u: AccountReceivable) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            
            <DropdownMenuItem disabled={u.accountStatus === "Paga"}  onClick={() => handleEditar(u)}>
              Editar
            </DropdownMenuItem>

            {/* Submenu de Status */}
            {u.accountStatus != "Paga" && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44">
                {["Pendente", "Paga", "Atrasada", "Parcial", "Cancelada"].map((s) => (
                  <DropdownMenuItem 
                    key={s}
                    onClick={() => handleToggleStatus(u, s)}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
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
  ];

  const contasFiltradas = accounts.filter((c) => {
    return (
      c.description.toLowerCase().includes(filterNome.toLowerCase()) &&
      c.guid.toLowerCase().includes(filterCnpj.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && c.accountStatus) ||
        (filterStatus === "inativo" && !c.accountStatus))
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Contas a Receber" description="Lista de Contas a Receber" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Contas a Receber", path: "/contas-a-receber" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Contas a Receber">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/contas-a-receber/criar")}
              >
                Nova conta a receber
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <input
                  type="text"
                  placeholder="Filtrar por descrição"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>

          <GenericTable columns={columns} data={contasFiltradas} />
        </ComponentCard>
      </div>
    </>
  );
}
