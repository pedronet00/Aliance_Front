import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormAutomaticAccount, { AutomaticAccountFormData } from "../Forms/FormAutomaticAccounts";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Error from "../OtherPage/Error";

export default function AutomaticAccountsEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AutomaticAccountFormData | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    apiClient
      .get(`/AutomaticAccounts/${guid}`)
      .then((res) => {
        const { result, hasNotifications, notifications } = res.data;

        if (hasNotifications) {
          setHasNotifications(true);
          setNotifications(notifications || []);
          return;
        }

        setAccount(result);
      })
      .catch(() => {
        setHasNotifications(true);
        setNotifications(["Erro ao carregar conta automática."]);
      });
  }, [guid]);

  const handleSubmit = async (data: AutomaticAccountFormData) => {
    await apiClient.put(`/AutomaticAccounts/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/contas-automaticas");
  };

  if (hasNotifications) {
    return <Error />;
  }

  if (!account) return <LoadingSpinner />;

  return (
    <>
      <PageMeta title="Editar Conta" description="Editar Conta" />
      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Contas Automáticas", path: "/contas-automaticas" },
          { label: "Editar Conta", path: `/contas-automaticas/editar/${guid}` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="">
          <FormAutomaticAccount initialData={account} onSubmit={handleSubmit} />
        </ComponentCard>
      </div>
    </>
  );
}
