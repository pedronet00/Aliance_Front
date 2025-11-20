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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { User } from "@/types/Usuario/User";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import Badge from "@/components/ui/badge/Badge";
import { showDeletedToast, showEditedSuccessfullyToast, showErrorToast, showSuccessToast } from "@/components/toast/Toasts";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleEditar = (u: User) => {
    navigate(`/membros/editar/${u.id}`);
  };

  const handleExcluir = async (u: User) => {
    try {
      await apiClient.delete(`/User/${u.id}`);

      showDeletedToast();
    } catch (err) {
      showErrorToast("Houve um erro ao excluir o usuário.");
    }
  };

  const handlePasswordDefinition = async (u: User) => {
    try {
      await apiClient.post(`/User/PasswordDefinitionMail/${u.id}`);

      showSuccessToast("Email enviado ao usuário com o link para redefinir a senha.");
    } catch (err) {
      showErrorToast("Houve um erro ao enviar o email de redefinição de senha.");
    }
  };

  const handleStatus = async (u: User) => {
    try {
      await apiClient.patch(`/User/status/${u.id}`);

      setUsuarios((prev) =>
        prev.map((usr) =>
          usr.id === u.id ? { ...usr, status: !usr.status } : usr
        )
      );

      showEditedSuccessfullyToast();
    } catch (err) {
      console.error("Erro ao alterar status do usuário", err);
    }
  };

  const columns = [
    { label: "Nome", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Telefone", key: "phoneNumber" },
    { label: "Cargo", key: "role" },
    {
      key: "status",
      label: "Status",
      render: (c: User) =>
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
    },
    {
      label: "Ações",
      render: (u: User) => (
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
            <DropdownMenuItem onClick={() => handlePasswordDefinition(u)}>
              Redefinir senha
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => handleEditar(u)}>
              Ver escalas
            </DropdownMenuItem> */}
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
