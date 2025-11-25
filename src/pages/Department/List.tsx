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
import { Department } from "@/types/Department/Department";
import NoData from "@/components/no-data";

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterNome, setFilterNome] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchDepartments = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/Department/paged?pageNumber=${page}&pageSize=${pageSize}`);
      const data = res.data;

      setDepartments(data.items || []);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.currentPage);
    } catch (err) {
      showErrorToast("Erro ao carregar departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments(currentPage);
  }, [currentPage]);

  const handleEditar = (u: Department) => navigate(`/departamentos/editar/${u.guid}`);

  const handleExcluir = async (u: Department) => {
    try {
      await apiClient.delete(`/Department/${u.guid}`);
      showDeletedToast();
      fetchDepartments(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar departamento: " + error);
    }
  };

  const handleStatus = async (u: Department) => {
    try {
      const endpoint = `Department/ToggleStatus/${u.guid}`;
      await apiClient.patch(endpoint);
      showEditedSuccessfullyToast();
      fetchDepartments(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    {
      key: "status",
      label: "Status",
      render: (c: Department) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (u: Department) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(u)}>Editar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/departamentos/${u.guid}/membros`)}>
              Ver membros
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                
                  <DropdownMenuItem onClick={() => handleStatus(u)}>
                    {u.status ? "Desativar" : "Ativar"}
                  </DropdownMenuItem>
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

  const filteredDepartments = departments.filter((c) => {
    return (
      c.name.toLowerCase().includes(filterNome.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && c.status) ||
        (filterStatus === "inativo" && !c.status))
    );
  });


  return (
    <>
      <PageMeta title="Departamentos" description="Lista de Departamentos" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Departamentos", path: "/departamentos" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Departamentos">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              <Button onClick={() => navigate("/departamentos/criar")}>Novo departamento</Button>
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

          {filteredDepartments.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredDepartments} />

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
