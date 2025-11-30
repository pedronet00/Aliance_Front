import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreDotIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  showDeletedToast,
  showEditedSuccessfullyToast,
  showErrorToast,
  showSuccessToast,
} from "@/components/toast/Toasts";
import Badge from "@/components/ui/badge/Badge";
import NoData from "@/components/no-data";
import { useAuth } from "@/context/AuthContext";

export default function MemberRolesListing() {
  const [roles, setRoles] = useState<string[]>([]);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { can } = useAuth();

  // ----------- Carregar roles do user -----------
  const loadRoles = async () => {
    try {
      const res = await apiClient.get(`/User/GetRoles/${userId}`);
      setRoles(res.data?.result ?? []);
    } catch (err) {
      showErrorToast("Erro ao carregar roles do usuário: " + err);
    }
  };

  // ----------- Carregar lista de roles do sistema -----------
  const loadAllRoles = async () => {
    try {
      const res = await apiClient.get("/Roles");
      setAllRoles(res.data ?? []);
    } catch (err) {
      showErrorToast("Erro ao carregar roles do sistema: " + err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    (async () => {
      await Promise.all([loadRoles(), loadAllRoles()]);
      setLoading(false);
    })();
  }, [userId]);

  // ----------- Remover Role -----------
  const handleRemoveRole = async (role: string) => {
    try {
      const res = await apiClient.delete(`/User/${userId}/RemoveRole/${role}`);

      if (res.data?.hasNotifications) {
        res.data.notifications.forEach((n: string) => showErrorToast(n));
        return;
      }

      showDeletedToast();
      await loadRoles();
    } catch (err) {
      showErrorToast("Erro ao remover role: " + err);
    }
  };

  // ----------- Adicionar Role -----------
  const handleAddRole = async (role: string) => {
    try {
      const res = await apiClient.post(`/User/${userId}/AssignRole/${role}`);

      if (res.data?.hasNotifications) {
        res.data.notifications.forEach((n: string) => showErrorToast(n));
        return;
      }

      showSuccessToast("Cargo adicionado com sucesso.");
      await loadRoles();
    } catch (err) {
      showErrorToast("Erro ao atribuir role: " + err);
    }
  };

  // ----------- Tabela -----------
  const columns = [
    {
      key: "role",
      label: "Cargo",
      render: (role: string) => <Badge size="sm">{role}</Badge>,
    },
    {
      label: "Ações",
      render: (role: string) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => handleRemoveRole(role)}
              className="text-destructive focus:text-destructive"
            >
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Cargos do Usuário" description="Gerenciar cargos do usuário" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Usuários", path: "/usuarios" },
          { label: "Cargos do Usuário", path: `/usuarios/${userId}/cargos` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Gerenciar Cargos do Usuário">
          <div className="flex justify-between items-center mb-4">
            <Button variant="secondary" onClick={() => navigate("/usuarios")}>
              Voltar
            </Button>

            {can(["Admin"]) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>Adicionar Cargo</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                  {allRoles
                    .filter((r) => !roles.includes(r))
                    .map((r) => (
                      <DropdownMenuItem key={r} onClick={() => handleAddRole(r)}>
                        {r}
                      </DropdownMenuItem>
                    ))}

                  {allRoles.filter((r) => !roles.includes(r)).length === 0 && (
                    <DropdownMenuItem disabled>Nenhum cargo disponível</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {roles.length > 0 ? (
            <GenericTable columns={columns} data={roles} />
          ) : (
            <NoData />
          )}
        </ComponentCard>
      </div>
    </>
  );
}
