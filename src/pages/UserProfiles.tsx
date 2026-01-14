import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "@/api/apiClient";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "@/components/common/ComponentCard";
import GenericTable from "@/components/tables/GenericTable";
import NoData from "@/components/no-data";
import { showErrorToast } from "@/components/toast/Toasts";
import { Presence } from "@/types/Presence/Presence";
import { RehearsalPresence } from "@/types/Presence/RehearsalPresence";

export default function UserProfiles() {
  const { userId } = useParams<{ userId: string }>();

  const [services, setServices] = useState<Presence[]>([]);
  const [rehearsals, setRehearsals] = useState<RehearsalPresence[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPresences = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [serviceRes, rehearsalRes] = await Promise.all([
        apiClient.get(
          `/Presence/service/by-user/${userId}?pageNumber=1&pageSize=1000`
        ),
        apiClient.get(
          `/Presence/rehearsal/by-user/${userId}?pageNumber=1&pageSize=1000`
        ),
      ]);

      setServices(serviceRes.data.result?.items || []);
      setRehearsals(rehearsalRes.data.result?.items || []);
    } catch (err) {
      showErrorToast("Erro ao carregar presenças do usuário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPresences();
  }, [userId]);

  const serviceColumns = [
    {
      key: "serviceDate",
      label: "Data do Culto",
      render: (p: Presence) =>
        new Date(p.serviceDate).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "serviceGuid",
      label: "Culto (ID)",
    },
  ];

  const rehearsalColumns = [
    {
      key: "serviceDate",
      label: "Data do Ensaio",
      render: (p: RehearsalPresence) =>
        new Date(p.serviceDate).toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
    {
      key: "rehearsalGuid",
      label: "Ensaio (ID)",
    },
  ];

  return (
    <>
      <PageMeta title="Perfil do Usuário" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Usuários", path: "/usuarios" },
          { label: "Perfil" },
        ]}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
          Perfil do Usuário
        </h3>

        <div className="space-y-6">
          <UserMetaCard />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UserInfoCard />
            <UserAddressCard />
          </div>

          {/* PRESENÇAS */}
          <ComponentCard title="Presenças do Usuário">
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-6">
                {/* Cultos */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-700">
                    Cultos
                  </h4>
                  {services.length > 0 ? (
                    <GenericTable
                      columns={serviceColumns}
                      data={services}
                    />
                  ) : (
                    <NoData />
                  )}
                </div>

                {/* Ensaios */}
                <div>
                  <h4 className="mb-2 font-semibold text-gray-700">
                    Ensaios
                  </h4>
                  {rehearsals.length > 0 ? (
                    <GenericTable
                      columns={rehearsalColumns}
                      data={rehearsals}
                    />
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            )}
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
