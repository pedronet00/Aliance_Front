import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate } from "react-router-dom";
import {
  showDeletedToast,
  showEditedSuccessfullyToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";
import Badge from "@/components/ui/badge/Badge";
import { CostCenter } from "@/types/CostCenter/CostCenter";
import NoData from "@/components/no-data";
import Error from "../OtherPage/Error";

export default function CostCenterList() {
  const [centers, setCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchCenters = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/CostCenter/paged?pageNumber=${page}&pageSize=${pageSize}`);
      const data = res.data;

      setCenters(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.currentPage);
    } catch (err) {
      showErrorToast("Erro ao carregar centros de custo");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters(currentPage);
  }, [currentPage]);

  const handleEditar = (u: CostCenter) => navigate(`/centros-de-custo/editar/${u.guid}`);

  const handleExcluir = async (u: CostCenter) => {
    try {
      await apiClient.delete(`/CostCenter/${u.guid}`);
      showDeletedToast();
      fetchCenters(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar centro de custo: " + error);
    }
  };

  const handleStatus = async (u: CostCenter, action: "activate" | "deactivate") => {
    try {
      const endpoint =
        action === "activate"
          ? `CostCenter/activate/${u.guid}`
          : `CostCenter/deactivate/${u.guid}`;
      await apiClient.patch(endpoint);
      showEditedSuccessfullyToast();
      fetchCenters(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "departmentName", label: "Departamento" },
    {
      key: "status",
      label: "Status",
      render: (c: CostCenter) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (u: CostCenter) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(u)}>Editar</DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {u.status ? (
                  <DropdownMenuItem onClick={() => handleStatus(u, "deactivate")}>
                    Desativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleStatus(u, "activate")}>
                    Ativar
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(u)}
              className="text-destructive focus:text-destructive"
            >
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredCenters = centers.filter((c) => {
    return (
      c.name.toLowerCase().includes(filterNome.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && c.status) ||
        (filterStatus === "inativo" && !c.status))
    );
  });

  if (loading) return <p>Carregando...</p>;

  if(error) return <Error/>;

  return (
    <>
      <PageMeta title="Centros de Custo" description="Lista de Centros de Custo" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Centros de Custo", path: "/centros-de-custo" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Centros de Custo">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              <Button onClick={() => navigate("/centros-de-custo/criar")}>
                Novo centro de custo
              </Button>
              <Button variant="secondary" onClick={() => setShowFilters((prev) => !prev)}>
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
                  <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            )}
          </div>

          {filteredCenters.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredCenters} />

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
