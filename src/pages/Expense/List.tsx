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

export default function ExpenseList() {
  const [Expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Expense")
      .then((res) => setExpenses(res.data))
      .catch((err) => showErrorToast("Erro ao carregar entradas: " + err))
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (Expense: Expense) => {
    navigate(`/financeiro/entradas/editar/${Expense.guid}`);
  };

  const handleExcluir = async (Expense: Expense) => {
    try {
      await apiClient.delete(`/Expense/${Expense.guid}`);
      showDeletedToast();
      setExpenses((prev) => prev.filter((i) => i.guid !== Expense.guid));
    } catch (error) {
      showErrorToast("Erro ao deletar entrada: " + error);
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
            <DropdownMenuItem disabled={i.category == "ContaPagar"} onClick={() => handleEditar(i)}>
              Editar
            </DropdownMenuItem>

            
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(i)}
              disabled={i.category == "ContaPagar"}
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

  const filteredExpenses = Expenses.filter((i) => {
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

          <GenericTable columns={columns} data={filteredExpenses} />
        </ComponentCard>
      </div>
    </>
  );
}
