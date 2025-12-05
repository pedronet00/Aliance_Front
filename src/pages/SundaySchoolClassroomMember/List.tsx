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
import { SundaySchoolClassroomMember } from "@/types/SundaySchoolClassroomMember/SundaySchoolClassroomMember";
import NoData from "@/components/no-data";
import { useAuth } from "@/context/AuthContext";


export default function SundaySchoolClassroomMembersList() {
  const [members, setMembers] = useState<SundaySchoolClassroomMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const { classroomGuid } = useParams<{ classroomGuid: string }>();
  const navigate = useNavigate();
  const {can} = useAuth();

  const loadData = async () => {
    if (!classroomGuid) return;

    try {
      const [membersRes] = await Promise.all([
        apiClient.get(`/SundaySchoolClassroomMembers/${classroomGuid}`),
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
  }, [classroomGuid]);

  const handleDelete = async (member: SundaySchoolClassroomMember) => {
    try {
      const response = await apiClient.delete(`/SundaySchoolClassroomMembers/${classroomGuid}/member/${member.userId}`);
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

  const handleStatus = async (member: SundaySchoolClassroomMember) => {
    try {
      await apiClient.patch(`/SundaySchoolClassroomMembers/${classroomGuid}/member/${member.userId}/status`);
      showEditedSuccessfullyToast();
      await loadData(); // ← Recarrega lista
    } catch (error) {
      showErrorToast("Erro ao alterar status: " + error);
    }
  };

  const columns = [
    {
      key: "fullName",
      label: "Nome do Membro",
      render: (m: SundaySchoolClassroomMember) => (
        <div className="flex items-center gap-2">
          <span>{m.userName ?? m.userId}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c: SundaySchoolClassroomMember) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: SundaySchoolClassroomMember) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>
          {can(["Admin", "Professor", "Secretaria"]) && (
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
          )}
        </DropdownMenu>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Membros da Classe de EBD" description="Lista de membros da classe de EBD" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Classes de EBD", path: "/classes-ebd" },
          { label: "Membros da Classe de EBD", path: `/classes-ebd/${classroomGuid}/membros` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Membros">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate('/classes-ebd')}>
              Voltar
            </Button>
            {can(["Admin", "Secretaria"]) && (
            <Button onClick={() => navigate(`/classes-ebd/${classroomGuid}/membros/criar`)}>
              Adicionar membro
            </Button>
            )}
          </div>

          {members.length > 0 ? <GenericTable columns={columns} data={members} /> : <NoData/>} 
        </ComponentCard>
      </div>
    </>
  );
}
