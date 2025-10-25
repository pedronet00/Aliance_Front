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
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import {
  showDeletedToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/Expense/Expense";
import NoData from "@/components/no-data";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchExpenses = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Expense/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data; // suporta ambos formatos

      setExpenses(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar saídas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(currentPage);
  }, [currentPage]);

  const handleEditar = (expense: Expense) => {
    navigate(`/financeiro/entradas/editar/${expense.guid}`);
  };

  const handleExcluir = async (expense: Expense) => {
    try {
      await apiClient.delete(`/Expense/${expense.guid}`);
      showDeletedToast();
      fetchExpenses(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar saída: " + error);
    }
  };

  const columns = [
    { key: "description", label: "Descrição" },
    {
      key: "amount",
      label: "Valor",
      render: (i: Expense) => `R$ ${i.amount.toFixed(2)}`,
    },
    {
      key: "date",
      label: "Data",
      render: (i: Expense) => new Date(i.date).toLocaleDateString("pt-BR"),
    },
    { key: "category", label: "Categoria" },
    {
      label: "Ações",
      render: (i: Expense) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              disabled={i.category === "ContaPagar"}
              onClick={() => handleEditar(i)}
            >
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(i)}
              disabled={i.category === "ContaPagar"}
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

  const filteredExpenses = expenses.filter((i) => {
    return (
      i.description.toLowerCase().includes(filterDescription.toLowerCase()) &&
      (filterCategory ? i.category === filterCategory : true)
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Saídas" description="Lista de Saídas Financeiras" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Saídas", path: "/saidas" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Saídas Financeiras">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/financeiro/saidas/criar")}>
                Nova saída
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
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todas as categorias</option>
                  <option value="Dizimo">Dízimo</option>
                  <option value="Oferta">Oferta</option>
                  <option value="Doacao">Doação</option>
                  <option value="Evento">Evento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            )}
          </div>

          {filteredExpenses.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredExpenses} />

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
