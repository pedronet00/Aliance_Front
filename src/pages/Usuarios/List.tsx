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
import { Usuario } from "@/types/Usuario/Usuario";
import { Button } from "@/components/ui/button";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    carregarUsuarios(currentPage);
  }, [currentPage]);

  const carregarUsuarios = async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        `/User/paged?pageNumber=${page}&pageSize=${pageSize}`
      );
      const data = res.data.result || res.data;

      setUsuarios(data.items || []);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (u: Usuario) => {
    console.log("Editar", u);
  };

  const handleExcluir = (u: Usuario) => {
    console.log("Excluir", u);
  };

  const handleAtivarDesativar = async (u: Usuario) => {
    try {
      const endpoint = u.status ? "/User/Deactivate" : "/User/Activate";
      await apiClient.patch(`${endpoint}/${u.id}`);

      setUsuarios((prev) =>
        prev.map((usr) =>
          usr.id === u.id ? { ...usr, status: !usr.status } : usr
        )
      );
    } catch (err) {
      console.error("Erro ao alterar status do usuário", err);
    }
  };

  const columns = [
    { label: "Nome", key: "userName" },
    { label: "Email", key: "email" },
    { label: "Telefone", key: "phone" },
    { label: "Cargo", key: "role" },
    {
      key: "status",
      label: "Status",
      render: (c: Usuario) =>
        c.status ? (
          <span className="text-green-600">Ativo</span>
        ) : (
          <span className="text-red-600">Inativo</span>
        ),
    },
    {
      label: "Ações",
      render: (u: Usuario) => (
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
            <DropdownMenuItem onClick={() => handleEditar(u)}>
              Redefinir senha
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditar(u)}>
              Ver escalas
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

  return (
    <>
      <PageMeta title="Usuários" description="Lista de Usuários" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Membros", path: "/membros" },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Usuários">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex gap-2">
              <Button
                onClick={() => (window.location.href = "/membros/criar")}
              >
                Novo Usuário
              </Button>

              <Button
                onClick={() => (window.location.href = "/membros/importar")}
                variant="outline"
              >
                Importar Usuários
              </Button>
            </div>
          </div>

          <GenericTable columns={columns} data={usuarios} />

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Página {currentPage} de {totalPages} — Total: {totalCount}
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
