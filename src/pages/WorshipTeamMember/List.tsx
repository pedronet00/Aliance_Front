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
import { WorshipTeamMember } from "@/types/WorshipTeamMember/WorshipTeamMember";


export default function WorshipTeamMemberList() {
  const [members, setMembers] = useState<WorshipTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { teamGuid } = useParams<{ teamGuid: string }>();
  const navigate = useNavigate();

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/WorshipTeamMember/${teamGuid}`);
      const membersData = res.data.items || res.data;
      setMembers(membersData);
    } catch (err) {
      showErrorToast("Erro ao carregar dados: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!teamGuid) return;
    fetchMembers();
  }, [teamGuid]);


  const handleDelete = async (member: WorshipTeamMember) => {
    try {
      await apiClient.delete(`/WorshipTeamMember/${teamGuid}/member/${member.userId}`);
      showDeletedToast();
      fetchMembers();
    } catch (error) {
      showErrorToast("Erro ao remover membro: " + error);
    }
  };

  const handleStatus = async (member: WorshipTeamMember) => {
    try {
      await apiClient.patch(`/WorshipTeamMember/${teamGuid}/member/${member.userId}/status`);
      showEditedSuccessfullyToast();
      fetchMembers();
    } catch (error) {
      showErrorToast("Erro ao remover membro: " + error);
    }
  };

  const columns = [
    {
      key: "userName",
      label: "Nome do Membro",
      render: (m: WorshipTeamMember) => (
        <div className="flex items-center gap-2">
          <span>{m.userName ?? m.userId}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c: WorshipTeamMember) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: WorshipTeamMember) => (
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
                    {m.status ? "Desativar" : "Ativar"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(m)}
              className="text-destructive focus:text-destructive"
            >
              <span>Remover</span>
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
      <PageMeta title="Membros da Célula" description="Lista de membros da célula" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Grupos de louvor", path: "/grupos-de-louvor" },
          { label: "Membros do Grupo", path: `/grupos-de-louvor/${teamGuid}/membros` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Membros">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate('/grupos-de-louvor')}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/grupos-de-louvor/${teamGuid}/membros/criar`)}>
              Adicionar membro
            </Button>
          </div>

          <GenericTable columns={columns} data={members} />
        </ComponentCard>
      </div>
    </>
  );
}
