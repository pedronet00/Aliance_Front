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
import NoData from "@/components/no-data";
import { useAuth } from "@/context/AuthContext";
import { Branch } from "@/types/Branch/Branch";

export default function BranchList() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { can } = useAuth();
  const navigate = useNavigate();

  const fetchBranches = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Branch/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data;

      setBranches(data.result.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.currentPage);
    } catch (err) {
      showErrorToast("Erro ao carregar filiais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches(currentPage);
  }, [currentPage]);

  const handleEditar = (m: Branch) => navigate(`/filiais/${m.guid}/editar`);

  const handleExcluir = async (m: Branch) => {
    try {
      await apiClient.delete(`/Branch/${m.guid}`);
      showDeletedToast();
      fetchBranches(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar missão: " + error);
    }
  };

  const handleStatus = async (m: Branch) => {
    try {
      await apiClient.patch(`/Branch/toggle-status/${m.guid}`);
      showEditedSuccessfullyToast();
      fetchBranches(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    { key: "city", label: "Cidade" },
    { key: "state", label: "Estado" },
    {
      key: "status",
      label: "Status",
      render: (m: Branch) => (
        <Badge size="sm" color={m.status ? "success" : "error"}>
          {m.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: Branch) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {can(["Admin", "Secretaria"]) && (
              <>
                <DropdownMenuItem onClick={() => handleEditar(m)}>
                  Editar
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleStatus(m)}>
                      {m.status ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleExcluir(m)}
                  className="text-destructive focus:text-destructive"
                >
                  Excluir
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filtered = branches.filter((m) => {
    return (
      m.name.toLowerCase().includes(filterNome.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && m.status) ||
        (filterStatus === "inativo" && !m.status))
    );
  });

  return (
    <>
      <PageMeta title="Filiais" description="Lista de Filiais" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Filiais", path: "/filiais" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Filiais">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              {can(["Admin", "Secretaria"]) && (
                <Button onClick={() => navigate("/filiais/criar")}>
                  Nova filial
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {filtered.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filtered} />

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
