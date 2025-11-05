import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormAutomaticAccount, { AutomaticAccountFormData } from "../Forms/FormAutomaticAccounts";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function AutomaticAccountsEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<AutomaticAccountFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/AutomaticAccounts/${guid}`).then((res) => {
      setAccount(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: AutomaticAccountFormData) => {
    await apiClient.put(`/AutomaticAccounts/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/contas-automaticas");
  };

   if (!account) return <LoadingSpinner/>;

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
