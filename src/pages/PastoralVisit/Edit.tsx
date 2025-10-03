import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormPastoralVisit, { PastoralVisitFormData } from "../Forms/FormPastoralVisit";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function PastoralVisitEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<PastoralVisitFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/PastoralVisit/${guid}`).then((res) => {
      setVisit(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: PastoralVisitFormData) => {
    await apiClient.put(`/PastoralVisit/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/visitas-pastorais");
  };

   if (!visit) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Visita" description="Editar Visita" />
        <PageBreadcrumb pageTitle="Editar Visita" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormPastoralVisit initialData={visit} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
