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
import { Location } from "@/types/Location/Location";
import NoData from "@/components/no-data";

export default function LocationList() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const fetchLocations = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/Location/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result;
      setLocations(data.items || []);
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
    fetchLocations(currentPage);
  }, [currentPage]);

  const handleEditar = (l: Location) => navigate(`/locais/editar/${l.id}`);

  const handleExcluir = async (l: Location) => {
    try {
      await apiClient.delete(`/Location/${l.id}`);
      showDeletedToast();
      fetchLocations(currentPage);
    } catch (error) {
      showErrorToast("Erro ao deletar local: " + error);
    }
  };

  const handleStatus = async (l: Location, action: "activate" | "deactivate") => {
    try {
      const endpoint =
        action === "activate" ? `Location/activate/${l.id}` : `Location/deactivate/${l.id}`;
      await apiClient.patch(endpoint);
      showEditedSuccessfullyToast();
      fetchLocations(currentPage);
    } catch (error) {
      showErrorToast("Erro ao atualizar status: " + error);
    }
  };

  const columns = [
    { key: "name", label: "Nome" },
    {
      key: "status",
      label: "Status",
      render: (l: Location) => (
        <Badge size="sm" color={l.status ? "success" : "error"}>
          {l.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (l: Location) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

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
        </DropdownMenu>
      ),
    },
  ];

  const filteredLocations = locations.filter((l) => {
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
      <PageMeta title="Locais" description="Lista de Locais" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Locais", path: "/locais" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard title="Lista de Locais">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3 items-center">
              <Button onClick={() => navigate("/locais/criar")}>Novo local</Button>
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

          {filteredLocations.length > 0 ? (
            <>
              <GenericTable columns={columns} data={filteredLocations} />

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
