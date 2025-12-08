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
import { CellMember } from "@/types/CellMember/CellMember";
import { useAuth } from "@/context/AuthContext";
import NoData from "@/components/no-data";


export default function CellMemberList() {
  const [members, setMembers] = useState<CellMember[]>([]);
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { cellGuid } = useParams<{ cellGuid: string }>();
  const navigate = useNavigate();
  const {can} = useAuth();

  const loadData = async () => {
    if (!cellGuid) return;

    try {
      const [membersRes, cellRes] = await Promise.all([
        apiClient.get(`/CellMember/${cellGuid}`),
        apiClient.get(`/Cell/${cellGuid}`),
      ]);

      setMembers(membersRes.data.result || membersRes.data);
      setLeaderId(cellRes.data.result?.leaderId || cellRes.data?.leaderId);
    } catch (err) {
      showErrorToast("Erro ao carregar dados: " + err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [cellGuid]);

  const handleDelete = async (member: CellMember) => {
    try {
      const response = await apiClient.delete(`/CellMember/${cellGuid}/member/${member.userId}`);
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

  const handleStatus = async (member: CellMember) => {
    try {
      await apiClient.patch(`/CellMember/${cellGuid}/member/${member.userId}/status`);
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
      render: (m: CellMember) => (
        <div className="flex items-center gap-2">
          <span>{m.userName ?? m.userId}</span>
          {leaderId === m.userId && (
            <Badge size="sm" color="primary">
              Líder
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (c: CellMember) => (
        <Badge size="sm" color={c.status ? "success" : "error"}>
          {c.status ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (m: CellMember) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
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
      <PageMeta title="Membros da Célula" description="Lista de membros da célula" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Células", path: "/celulas" },
          { label: "Membros da Célula", path: `/celulas/${cellGuid}/membros` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Membros">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate('/celulas')}>
              Voltar
            </Button>
            {can(["Admin", "Pastor", "Professor","Secretaria"]) && (
            <Button onClick={() => navigate(`/celulas/${cellGuid}/membros/criar`)}>
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
