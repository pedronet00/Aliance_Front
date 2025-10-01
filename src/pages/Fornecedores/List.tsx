import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import { useEffect, useState } from "react";
import { MoreDotIcon } from "@/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageMeta from "@/components/common/PageMeta";
import { MessagesSquare } from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Fornecedor } from "@/types/Fornecedor/Fornecedor";
import { useNavigate } from "react-router-dom";
import { showDeletedToast, showErrorToast, showToggleStatusToast } from "@/components/toast/Toasts";
import { Button } from "@/components/ui/button";

export default function FornecedoresList() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filterNome, setFilterNome] = useState("");
  const [filterCnpj, setFilterCnpj] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Fornecedores")
      .then((res) => setFornecedores(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: Fornecedor) => {
    navigate(`/fornecedores/editar/${u.id}`);
  };

  const handleExcluir = async (u: Fornecedor) => {
    try {
      await apiClient.delete(`/Fornecedores/${u.id}`);
      showDeletedToast();
      setFornecedores((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      showErrorToast();
    }
  };

  const handleAtivarDesativar = async (u: Fornecedor) => {
    try {
      var endpoint = u.status == true ? "deactivate" : "activate";
      await apiClient.patch(`/Fornecedores/${endpoint}/${u.id}`, {
        status: !u.status,
      });
      showToggleStatusToast();
      setFornecedores((prev) =>
        prev.map((c) =>
          c.id === u.id ? { ...c, status: !c.status } : c
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar status do fornecedor:", error);
      alert("Erro ao atualizar status do fornecedor.");
    }
  };

  const handleWhatsappMessage = (u: Fornecedor) => {
    const url = `https://wa.me/${u.telefone}`;
    window.open(url, "_blank");
  };

  const columns = [
    { key: "nome" },
    { key: "email" },
    {
      key: "status",
      label: "Status",
      render: (c: Fornecedor) =>
        c.status ? (
          <span className="text-green-600">Ativo</span>
        ) : (
          <span className="text-red-600">Inativo</span>
        ),
    },
    {
      label: "Ações",
      render: (u: Fornecedor) => (
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
            <DropdownMenuItem onClick={() => handleAtivarDesativar(u)}>
              {u.status ? "Desativar" : "Ativar"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleWhatsappMessage(u)}>
              Contato
              <MessagesSquare className="ml-auto h-4 w-4 opacity-50" />
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

  const fornecedoresFiltrados = fornecedores.filter((f) => {
    return (
      (!filterNome || f.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
      (!filterCnpj || f.cnpj?.includes(filterCnpj)) &&
      (!filterStatus ||
        (filterStatus === "ativo" && f.status) ||
        (filterStatus === "inativo" && !f.status))
    );
  });

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Fornecedores" description="Lista de Fornecedores" />
      <PageBreadcrumb pageTitle="Fornecedores" />
      <div className="space-y-6">
        <ComponentCard title="Lista de Fornecedores">
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex gap-3">
              <Button
                onClick={() => (window.location.href = "/fornecedores/criar")}
              >
                Novo Fornecedor
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
                  placeholder="Filtrar por Nome"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="text"
                  placeholder="Filtrar por CNPJ"
                  value={filterCnpj}
                  onChange={(e) => setFilterCnpj(e.target.value)}
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

          <GenericTable columns={columns} data={fornecedoresFiltrados} />
        </ComponentCard>
      </div>
    </>
  );
}
