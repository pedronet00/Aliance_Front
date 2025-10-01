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
import {
  showDeletedToast,
  showErrorToast,
  showToggleStatusToast,
} from "@/components/toast/Toasts";
import { Cliente } from "@/types/Cliente/Cliente";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // se já tiver um componente Input
import Select from "@/components/form/Select"; // seu Select já existente
import { Funnel, FileText } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

export default function ClientesList() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNome, setFilterNome] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "ativo" | "inativo">("all");
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/Clientes")
      .then((res) => setClientes(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (u: Cliente) => {
    navigate(`/clientes/editar/${u.id}`);
  };

  const handleExcluir = async (u: Cliente) => {
    try {
      await apiClient.delete(`/Clientes/${u.id}`);
      showDeletedToast();
      setClientes((prev) => prev.filter((c) => c.id !== u.id));
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Ocorreu um erro inesperado.";
      showErrorToast(message);
    }
  };

  const handleAtivarDesativar = async (u: Cliente) => {
    try {
      var endpoint = u.status ? "deactivate" : "activate";
      const response = await apiClient.patch(`/Clientes/${endpoint}/${u.id}`);

      const data = response.data;

      if (data.hasNotifications && !data.hasResult) {
        const message = data.notifications.join("");
        showErrorToast(message);
        return;
      }

      showToggleStatusToast();
      setClientes((prev) =>
        prev.map((c) =>
          c.id === u.id ? { ...c, status: !c.status } : c
        )
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Ocorreu um erro inesperado.";
      showErrorToast(message);
    }
  };

  const columns = [
    { key: "nome" },
    { key: "email" },
    {
      key: "status",
      label: "Status",
      render: (c: Cliente) =>
        <Badge size="sm" color={c.status == true ? "success" : "error"}>
          {c.status == true ? "Ativo" : "Inativo"}
        </Badge>
    },
    {
      label: "Ações",
      render: (u: Cliente) => (
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

  if (loading) return <p>Carregando...</p>;

  // aplica filtros
  const filteredClientes = clientes.filter((c) => {
    const matchNome = c.nome.toLowerCase().includes(filterNome.toLowerCase());
    const matchStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "ativo"
        ? c.status === true
        : c.status === false;
    return matchNome && matchStatus;
  });

  return (
    <>
    <PageMeta title="Clientes" description="Lista de Clientes" />
    <PageBreadcrumb pageTitle="Clientes" />
    <div className="space-y-6">
      <ComponentCard title="Lista de Clientes">
        {/* Botões principais */}
        <div className="flex items-center mb-4 gap-3 flex-wrap">
          <Button onClick={() => navigate("/clientes/criar")}>
            Novo Cliente
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Funnel className="w-5 h-5 text-black" />
            {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </Button>

          <Button
            onClick={() => navigate("/clientes/relatorio")}
            className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
          >
            <FileText className="w-5 h-5 text-white" />
            Relatório
          </Button>
        </div>

        {/* Div de filtros, aparece somente se showFilters = true */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <input
              placeholder="Filtrar por nome"
              value={filterNome}
              onChange={(e) => setFilterNome(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={filterStatus}
              onChange={(val) => setFilterStatus(val as string)}
              className="border p-2 w-full"
            >
              <option value="">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
            </select>
          </div>
        )}

        <GenericTable columns={columns} data={filteredClientes} />
      </ComponentCard>
    </div>
  </>
  );
}
