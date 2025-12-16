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
import { Income } from "@/types/Income/Income";
import NoData from "@/components/no-data";

export default function IncomeList() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDescription, setFilterDescription] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchIncomes = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Income/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data; // suporta ambos formatos

      setIncomes(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar entradas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes(currentPage);
  }, [currentPage]);

  const handleExcluir = async (income: Income) => {
    try {
      await apiClient.delete(`/Income/${income.guid}`);
      showDeletedToast();
      fetchIncomes(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar entrada: " + error);
    }
  };

  const columns = [
    { key: "description", label: "Descrição" },
    {
      key: "amount",
      label: "Valor",
      render: (i: Income) => `R$ ${i.amount.toFixed(2)}`,
    },
    {
      key: "date",
      label: "Data",
      render: (i: Income) => new Date(i.date).toLocaleDateString("pt-BR"),
    },
    { key: "category", label: "Categoria" },
    {
      label: "Ações",
      render: (i: Income) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              disabled={i.category == "ContaReceber" || i.category == "DoacaoCampanhaMissoes" || i.category == "Dizimo"}
              onClick={() => handleExcluir(i)}
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

  const filteredIncomes = incomes.filter((i) => {
    return (
      i.description.toLowerCase().includes(filterDescription.toLowerCase()) &&
      (filterCategory ? i.category === filterCategory : true)
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Entradas" description="Lista de Entradas Financeiras" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Entradas", path: "/entradas" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Entradas Financeiras">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/financeiro/entradas/criar")}>
                Nova entrada
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

          {filteredIncomes.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredIncomes} />

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
