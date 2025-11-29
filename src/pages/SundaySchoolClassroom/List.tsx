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
import { SundaySchoolClassroom } from "@/types/SundaySchoolClassroom/SundaySchoolClassroom";
import { useAuth } from "@/context/AuthContext";

export default function SundaySchoolClassroomList() {
  const [classes, setClasses] = useState<SundaySchoolClassroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const {can} = useAuth();

  const navigate = useNavigate();

  const fetchClasses = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/SundaySchoolClassroom/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result;
      setClasses(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar locais");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(currentPage);
  }, [currentPage]);

  const handleEditar = (l: SundaySchoolClassroom) => navigate(`/classes-ebd/editar/${l.guid}`);

  const handleExcluir = async (l: SundaySchoolClassroom) => {
    try {
      await apiClient.delete(`/SundaySchoolClassroom/${l.guid}`);
      showDeletedToast();
      fetchClasses(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar local: " + error);
    }
  };

  const handleStatus = async (l: SundaySchoolClassroom, action: "activate" | "deactivate") => {
    try {
      const endpoint =
        action === "activate" ? `SundaySchoolClassroom/activate/${l.id}` : `SundaySchoolClassroom/deactivate/${l.guid}`;
      await apiClient.patch(endpoint);
      showEditedSuccessfullyToast();
      fetchClasses(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    {
      key: "status",
      label: "Status",
      render: (l: SundaySchoolClassroom) => (
        <Badge size="sm" color={l.status ? "success" : "error"}>
          {l.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (l: SundaySchoolClassroom) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>
          {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEditar(l)}>Editar</DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {l.status ? (
                  <DropdownMenuItem onClick={() => handleStatus(l, "deactivate")}>
                    Desativar
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleStatus(l, "activate")}>
                    Ativar
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleExcluir(l)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
          )}
        </DropdownMenu>
      ),
    },
  ];

  const filteredClasses = classes.filter((l) => {
    return (
      l.name.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterStatus === "" ||
        (filterStatus === "ativo" && l.status) ||
        (filterStatus === "inativo" && !l.status))
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Classes de EBD" description="Lista de Classes de EBD" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Classes de EBD", path: "/classes-ebd" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Classes de EBD">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
              <Button onClick={() => navigate("/classes-ebd/criar")}>Nova classe</Button>
              )}
              <Button variant="secondary" onClick={() => setShowFilters((prev) => !prev)}>
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <input
                  type="text"
                  placeholder="Filtrar por nome"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
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

          {filteredClasses.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredClasses} />

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
