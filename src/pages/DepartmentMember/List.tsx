import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
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
import { MoreDotIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  showDeletedToast,
  showEditedSuccessfullyToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import Badge from "@/components/ui/badge/Badge";
import { DepartmentMember } from "@/types/DepartmentMember/DepartmentMember";
import NoData from "@/components/no-data";


export default function DepartmentMemberList() {
  const [members, setMembers] = useState<DepartmentMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { departmentGuid } = useParams<{ departmentGuid: string }>();
  const navigate = useNavigate();

  const loadData = async () => {
    if (!departmentGuid) return;

    try {
      const [membersRes] = await Promise.all([
        apiClient.get(`/DepartmentMember/${departmentGuid}`),
      ]);

      setMembers(membersRes.data?.items ?? membersRes.data);
    } catch (err) {
      showErrorToast("Erro ao carregar dados: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [departmentGuid]);

  const handleDelete = async (member: DepartmentMember) => {
    try {
      const response = await apiClient.delete(`/DepartmentMember/${departmentGuid}/member/${member.userId}`);
      const result = response.data;

      if (result?.hasNotifications && result.notifications.length > 0) {
        result.notifications.forEach((n: string) => showErrorToast(n));
        return;
      }

      showDeletedToast();
      await loadData(); // ← Recarrega lista
    } catch (error) {
      showErrorToast("Erro ao remover membro: " + error);
    }
  };

  const handleStatus = async (member: DepartmentMember) => {
    try {
      await apiClient.patch(`/DepartmentMember/${departmentGuid}/member/${member.userId}/status`);
      showEditedSuccessfullyToast();
      await loadData(); // ← Recarrega lista
    } catch (error) {
      showErrorToast("Erro ao alterar status: " + error);
    }
  };

  const columns = [
    {
      key: "userName",
      label: "Nome do Membro",
      render: (m: DepartmentMember) => (
        <div className="flex items-center gap-2">
          <span>{m.userName ?? m.userId}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c: DepartmentMember) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: DepartmentMember) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                <DropdownMenuItem onClick={() => handleStatus(m)}>
                    {m.status ? "Inativar" : "Ativar"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(m)}
              className="text-destructive focus:text-destructive"
            >
              <span>Remover</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Membros do Departamento" description="Lista de membros do departamento" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Departamentos", path: "/departamentos" },
          { label: "Membros do Departamento", path: `/departamentos/${departmentGuid}/membros` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Membros">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate('/departamentos')}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/departamentos/${departmentGuid}/membros/criar`)}>
              Adicionar membro
            </Button>
          </div>

          {members.length > 0 ? <GenericTable columns={columns} data={members} /> : <NoData/>} 
        </ComponentCard>
      </div>
    </>
  );
}
