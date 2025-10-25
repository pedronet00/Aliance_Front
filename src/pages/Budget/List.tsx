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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { Budget } from "@/types/Budget/Budget";
import { MailIcon } from "lucide-react";
import NoData from "@/components/no-data";

export default function BudgetList() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  type StatusAction = "approve" | "reject" | "contest";

  const carregarBudgets = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Budget/paged?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data.result || res.data;
      setBudgets(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar orçamentos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarBudgets(currentPage);
  }, [currentPage]);

  const handleEditar = (u: Budget) => {
    navigate(`/orcamentos/editar/${u.guid}`);
  };

  const handleExcluir = async (u: Budget) => {
    try {
      await apiClient.delete(`/Budget/${u.guid}`);
      showDeletedToast();
      carregarBudgets(currentPage); // recarrega a página atual
    } catch (error) {
      showErrorToast("Erro ao deletar orçamento: " + error);
    }
  };

  async function handleStatus(item: { guid: string }, action: StatusAction) {
    try {
      const endpointMap: Record<StatusAction, string> = {
        approve: `Budget/${item.guid}/approve`,
        reject: `Budget/${item.guid}/reject`,
        contest: `Budget/${item.guid}/contest`,
      };

      await apiClient.patch(endpointMap[action]);
      carregarBudgets(currentPage);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  }

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    { key: "totalAmount", label: "Total" },
    { key: "startDate", label: "Data de lançamento" },
    { key: "endDate", label: "Prazo" },
    {
      key: "status",
      label: "Status",
      render: (c: Budget) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          PendenteAprovacao: { color: "warning", label: "Pendente" },
          Aprovado: { color: "success", label: "Aprovado" },
          Rejeitado: { color: "error", label: "Rejeitado" },
          Contestado: { color: "info", label: "Contestado" },
          Encerrado: { color: "secondary", label: "Encerrado" },
        };
        const status = statusMap[c.status] ?? {
          color: "default",
          label: c.status,
        };
        return (
          <Badge size="sm" color={status.color}>
            {status.label}
          </Badge>
        );
      },
    },
    { key: "costCenterName", label: "Centro de Custo" },
    {
      label: "Ações",
      render: (u: Budget) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              disabled={u.status == "Aprovado" || u.status == "Rejeitado"}
              onClick={() => handleEditar(u)}
            >
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditar(u)}>
              Enviar email
              <DropdownMenuShortcut>
                <MailIcon className="h-4 w-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            {u.status !== "Aprovado" &&
              u.status !== "Rejeitado" &&
              u.status !== "Encerrado" && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuItem onClick={() => handleStatus(u, "approve")}>
                      Aprovar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatus(u, "reject")}>
                      Rejeitar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatus(u, "contest")}
                    >
                      Contestar
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(u)}
              disabled={u.status == "Aprovado" || u.status == "Rejeitado"}
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

  // Filtros client-side aplicados apenas na página atual
  const contasFiltradas = budgets.filter((c) => {
    return (
      c.description.toLowerCase().includes(filterNome.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && c.status) ||
        (filterStatus === "inativo" && !c.status))
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Orçamentos" description="Lista de Orçamentos" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Orçamentos", path: "/orcamentos" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Orçamentos">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => (window.location.href = "/orcamentos/criar")}>
                Novo orçamento
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

          {contasFiltradas.length > 0 ? (
            <>
              <GenericTable columns={columns} data={contasFiltradas} />

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} — Total: {totalCount}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
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
