import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormWorshipTeam, { WorshipTeamFormData } from "../Forms/FormWorshipTeam";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function WorshipTeamEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<WorshipTeamFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/WorshipTeam/${guid}`).then((res) => {
      setCenter(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: WorshipTeamFormData) => {
    await apiClient.put(`/WorshipTeam`, data);
    showEditedSuccessfullyToast();
    navigate("/grupos-de-louvor");
  };

   if (!center) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Grupo de Louvor" description="Editar Grupo de Louvor" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Grupos de Louvor", path: "/grupos-de-louvor" },
            { label: "Editar Grupo de Louvor", path: `/grupos-de-louvor/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormWorshipTeam initialData={center} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
