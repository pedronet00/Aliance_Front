import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import NoData from "@/components/no-data";
import { SundaySchoolClass } from "@/types/SundaySchoolClass/SundayShoolClass";

export default function SundaySchoolClassList() {
  const [classes, setClasses] = useState<SundaySchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterLesson, setFilterLesson] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchClasses = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/SundaySchoolClass/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data;

      setClasses(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      showErrorToast("Erro ao carregar aulas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(currentPage);
  }, [currentPage]);

  const handleEditar = (c: SundaySchoolClass) =>
    navigate(`/aulas-ebd/editar/${c.guid}`);

  const handleExcluir = async (c: SundaySchoolClass) => {
    try {
      await apiClient.delete(`/SundaySchoolClass/${c.guid}`);
      showDeletedToast();
      fetchClasses(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar classe: " + error);
    }
  };

  const columns = [
    { key: "lesson", label: "Lição" },
    { key: "teacherName", label: "Professor" },
    { key: "sundaySchoolClassroomName", label: "Sala" },
    {
      label: "Ações",
      render: (c: SundaySchoolClass) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">

            <DropdownMenuItem onClick={() => handleEditar(c)}>
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleExcluir(c)}
              className="text-destructive focus:text-destructive"
            >
              Excluir
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filteredClasses = classes.filter((c) => {
    return (
      c.lesson.toLowerCase().includes(filterLesson.toLowerCase()) &&
      c.teacherName?.toLowerCase().includes(filterTeacher.toLowerCase())
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Aulas de EBD" description="Lista de Aulas de EBD" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Aulas de EBD", path: "/aulas-ebd" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Aulas de EBD">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              <Button onClick={() => navigate("/aulas-ebd/criar")}>
                Nova aula
              </Button>
              <Button variant="secondary" onClick={() => setShowFilters(p => !p)}>
                {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <input
                  type="text"
                  placeholder="Filtrar por lição"
                  value={filterLesson}
                  onChange={(e) => setFilterLesson(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Filtrar por professor"
                  value={filterTeacher}
                  onChange={(e) => setFilterTeacher(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            )}
          </div>

          {filteredClasses.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredClasses} />

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
