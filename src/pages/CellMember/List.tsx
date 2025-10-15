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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreDotIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  showDeletedToast,
  showErrorToast,
} from "@/components/toast/Toasts";
import Badge from "@/components/ui/badge/Badge";

type CellMember = {
  id: number;
  guid: string;
  cellGuid: string;
  userId: string;
  userName?: string;
  status?: boolean;
};

export default function CellMemberList() {
  const [members, setMembers] = useState<CellMember[]>([]);
  const [leaderId, setLeaderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { cellGuid } = useParams<{ cellGuid: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cellGuid) return;

    const loadData = async () => {
      try {
        // Busca membros da célula
        const [membersRes, cellRes] = await Promise.all([
          apiClient.get(`/CellMember/${cellGuid}`),
          apiClient.get(`/Cell/${cellGuid}`),
        ]);

        const membersData = membersRes.data.result || membersRes.data;
        setMembers(membersData);

        // Armazena o líder
        const leader = cellRes.data.result?.leaderId || cellRes.data?.leaderId;
        setLeaderId(leader);
      } catch (err) {
        showErrorToast("Erro ao carregar dados: " + err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cellGuid]);

  const handleDelete = async (member: CellMember) => {
    try {
      await apiClient.delete(`/CellMember/${cellGuid}/member/${member.userId}`);
      showDeletedToast();
      setMembers((prev) => prev.filter((m) => m.guid !== member.guid));
    } catch (error) {
      showErrorToast("Erro ao remover membro: " + error);
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

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() =>
                navigate(`/celulas/${cellGuid}/membros/editar/${m.guid}`)
              }
            >
              Editar
            </DropdownMenuItem>

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
          { label: "Células", path: "/celulas" },
          { label: "Membros da Célula", path: `/celulas/${cellGuid}/membros` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Lista de Membros">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/celulas/${cellGuid}/membros/criar`)}>
              Adicionar membro
            </Button>
          </div>

          <GenericTable columns={columns} data={members} />
        </ComponentCard>
      </div>
    </>
  );
}
