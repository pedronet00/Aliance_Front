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
import NoData from "@/components/no-data";

export default function AccountReceivableList() {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  const navigate = useNavigate();

  const fetchAccounts = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/AccountReceivable/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data;

      setAccounts(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Erro ao carregar contas:", error);
      showErrorToast("Erro ao carregar contas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage);
  }, [currentPage]);

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
        { key: "dueDate", label: "Vencimento", render: (c: AccountReceivable) => c.dueDate ? new Date(c.dueDate).toLocaleDateString() : "-", },
        { key: "amount", label: "Valor", render: (c: AccountReceivable) => "R$ " + c.amount},
        { key: "paymentDate", label: "Pagamento", render: (c: AccountReceivable) => c.paymentDate ? new Date(c.paymentDate).toLocaleDateString() : "-"},
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
            {u.accountStatus !== "Paga" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  {["Pendente", "Paga", "Atrasada", "Parcial", "Cancelada"].map((s) => (
                    <DropdownMenuItem key={s} onClick={() => handleToggleStatus(u, s)}>
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            <DropdownMenuSeparator />

              
            <DropdownMenuItem 
              disabled={u.accountStatus === "Paga"} 
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
              <Button onClick={() => navigate("/contas-a-receber/criar")}>
                Nova conta a receber
              </Button>
              <Button variant="secondary" onClick={() => setShowFilters((prev) => !prev)}>
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

          {accounts.length > 0 ? (
            <>
              <GenericTable columns={columns} data={accounts} />

              {/* Paginação */}
              <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-600 text-center md:text-left">
                  Página {currentPage} de {totalPages} — Total: {totalCount}
                </p>

                <div className="flex justify-center gap-2 md:justify-end">
                  <Button
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <NoData />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
