import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import GenericTable from "@/components/tables/GenericTable";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { Button } from "@/components/ui/button";
import { showErrorToast, showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { User } from "@/types/Usuario/User";

export default function AddWorshipTeamRehearsalPresence() {
  const { guidEquipe, rehearsalGuid } = useParams<{
    guidEquipe: string;
    rehearsalGuid: string;
  }>();

  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/User/active");
      setUsers(res.data.result || []);
    } catch (err) {
      showErrorToast("Erro ao carregar usuários ativos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddPresence = async (userId: string) => {
    try {
      await apiClient.post("/Presence/rehearsal", {
        rehearsalGuid: rehearsalGuid,
        userId,
      });

      showEditedSuccessfullyToast();
      navigate(-1);
    } catch (err) {
      showErrorToast("Erro ao registrar presença");
    }
  };

  const columns = [
    { key: "fullName", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "phoneNumber", label: "Telefone" },
    {
      label: "Ação",
      render: (u: User) => (
        <Button size="sm" onClick={() => handleAddPresence(u.id)}>
          Adicionar
        </Button>
      ),
    },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <>
      <PageMeta title="Adicionar Presença ao Ensaio" description={""} />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Grupos de Louvor", path: "/grupos-de-louvor" },
          { label: "Ensaios" },
          { label: "Adicionar Presença" },
        ]}
      />

      <ComponentCard title="Usuários Ativos">
        <div className="mb-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>

        <GenericTable columns={columns} data={users} />
      </ComponentCard>
    </>
  );
}
