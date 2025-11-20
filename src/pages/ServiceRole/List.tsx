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
import NoData from "@/components/no-data";

type ServiceRole = {
  id: number;
  guid: string;
  serviceGuid: string;
  memberId: string;
  memberName?: string;
  role: string;
};

export default function ServiceRoleList() {
  const [roles, setRoles] = useState<ServiceRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { serviceGuid } = useParams<{ serviceGuid: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!serviceGuid) return;

    const loadData = async () => {
      try {
        const response = await apiClient.get(`/ServiceRole/service/${serviceGuid}`);
        const data = response.data.result || response.data;
        setRoles(data);
      } catch (err) {
        showErrorToast("Erro ao carregar escalas: " + err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [serviceGuid]);

  const handleDelete = async (role: ServiceRole) => {
    try {
      await apiClient.delete(`/ServiceRole/${role.guid}`);
      showDeletedToast();
      setRoles((prev) => prev.filter((r) => r.guid !== role.guid));
    } catch (error) {
      showErrorToast("Erro ao remover escala: " + error);
    }
  };

  const columns = [
    {
      key: "memberName",
      label: "Membro",
      render: (r: ServiceRole) => (
        <span>{r.memberName ?? r.memberId}</span>
      ),
    },
    {
      key: "role",
      label: "Cargo",
      render: (r: ServiceRole) => (
        <Badge size="sm" color="primary">
          {r.role}
        </Badge>
      ),
    },
    {
      label: "Ações",
      render: (r: ServiceRole) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreDotIcon />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => handleDelete(r)}
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
      <PageMeta
        title="Escalas do Culto"
        description="Lista de cargos e participantes de um culto"
      />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Cultos", path: "/cultos" },
          { label: "Escalas", path: `/cultos/${serviceGuid}/escalas` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="Escalas do Culto">
          <div className="flex justify-between items-center mb-4">
            <Button variant={"secondary"} onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={() => navigate(`/cultos/${serviceGuid}/escalas/criar`)}>
              Adicionar Escala
            </Button>
          </div>
          {roles.length === 0 ? <NoData/> : <GenericTable columns={columns} data={roles} />}
        </ComponentCard>
      </div>
    </>
  );
}
