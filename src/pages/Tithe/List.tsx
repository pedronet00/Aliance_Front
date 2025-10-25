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
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { Button } from "@/components/ui/button";
import { Tithe } from "@/types/Tithe/Tithe";
import { showDeletedToast, showErrorToast } from "@/components/toast/Toasts";
import NoData from "@/components/no-data";

export default function TitheList() {
  const [tithes, setTithes] = useState<Tithe[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    carregarDizimos(currentPage);
  }, [currentPage]);

  const carregarDizimos = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Tithe/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data;

      setTithes(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      showErrorToast("Erro ao carregar dízimos: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (t: Tithe) => {
    window.location.href = `/dizimos/editar/${t.guid}`;
  };

  const handleExcluir = async (t: Tithe) => {
    try {
      await apiClient.delete(`/Tithe/${t.guid}`);
      showDeletedToast();
      carregarDizimos(currentPage);
    } catch (error) {
      showErrorToast("Erro ao excluir dízimo: " + error);
    }
  };

  const columns = [
    { label: "Membro", key: "userName" },
    {
      label: "Valor",
      key: "amount",
      render: (t: Tithe) => `R$ ${t.amount.toFixed(2)}`,
    },
    {
      label: "Data",
      key: "date",
      render: (t: Tithe) => new Date(t.date).toLocaleDateString(),
    },
    {
      label: "Ações",
      render: (t: Tithe) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(t)}>
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(t)}
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

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Dízimos" description="Lista de Dízimos Registrados" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Dízimos", path: "/dizimos" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Dízimos">
          <Button
            onClick={() => (window.location.href = "/dizimos/criar")}
            className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            Registrar Dízimo
          </Button>

          {tithes.length > 0 ? (
            <>
              <GenericTable columns={columns} data={tithes} />

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
