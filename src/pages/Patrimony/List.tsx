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
import Badge from "@/components/ui/badge/Badge";
import { Patrimony } from "@/types/Patrimony/Patrimony";
import NoData from "@/components/no-data";

export default function PatrimonyList() {
  const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchPatrimonies = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Patrimony/paged?pageNumber=${page}&pageSize=${pageSize}`
      );

      const data = res.data;
      setPatrimonies(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);

      if (currentPage !== data.currentPage) {
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      showErrorToast("Erro ao carregar patrimônios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrimonies(1);
  }, []);

  const handleEditar = (u: Patrimony) => {
    navigate(`/patrimonios/editar/${u.guid}`);
  };

  const handleExcluir = async (u: Patrimony) => {
    try {
      await apiClient.delete(`/Patrimony/${u.id}`);
      showDeletedToast();
      fetchPatrimonies(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar patrimônio: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "description", label: "Descrição" },
    {
      key: "unitValue",
      label: "Valor Unitário",
      render: (u: Patrimony) => `R$ ${u.unitValue.toFixed(2)}`,
    },
    { key: "quantity", label: "Qtd." },
    {
      key: "totalValue",
      label: "Valor Total",
      render: (u: Patrimony) => `R$ ${u.totalValue.toFixed(2)}`,
    },
    {
      key: "acquisitionDate",
      label: "Data de Aquisição",
      render: (u: Patrimony) =>
        new Date(u.acquisitionDate).toLocaleDateString(),
    },
    {
      key: "condition",
      label: "Condição",
      render: (s: Patrimony) => {
        const conditionMap: Record<string, { color: string; label: string }> = {
          Novo: { color: "success", label: "Novo" },
          Bom: { color: "primary", label: "Bom" },
          Usado: { color: "warning", label: "Usado" },
          Danificado: { color: "error", label: "Danificado" },
        };
        const status = conditionMap[s.condition] ?? {
          color: "default",
          label: s.condition,
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
      render: (u: Patrimony) => (
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
            <DropdownMenuItem
              onClick={() => navigate(`/patrimonios/${u.guid}/documentos`)}
            >
              Ver documentos
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
  ];

  const filteredPatrimonies = patrimonies.filter((c) => {
    const matchesName = c.name
      .toLowerCase()
      .includes(filterNome.toLowerCase());
    const matchesStatus =
      !filterStatus || c.condition?.toLowerCase() === filterStatus.toLowerCase();
    return matchesName && matchesStatus;
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Patrimônios" description="Lista de Patrimônios" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Patrimônios", path: "/patrimonios" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Patrimônios">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button onClick={() => navigate("/patrimonios/criar")}>
                Novo patrimônio
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
                  placeholder="Filtrar por nome"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Todas as Condições</option>
                  <option value="Bom">Bom</option>
                  <option value="Regular">Regular</option>
                  <option value="Ruim">Ruim</option>
                </select>
              </div>
            )}
          </div>

          {filteredPatrimonies.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredPatrimonies} />

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
