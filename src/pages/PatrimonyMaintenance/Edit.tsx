import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormPatrimonyMaintenance, { PatrimonyMaintenanceFormData } from "../Forms/FormPatrimonyMaintenance";
import { showEditedSuccessfullyToast, showErrorToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function PatrimonyMaintenanceEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState<PatrimonyMaintenanceFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/PatrimonyMaintenance/${guid}`).then((res) => {
      setMaintenance(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: PatrimonyMaintenanceFormData) => {
    var response = await apiClient.put(`/PatrimonyMaintenance`, data);
    if(response.data.notifications.length > 0){
      //mostrar toast de erro
      showErrorToast(response.data.notifications[0].message);
    }
    showEditedSuccessfullyToast();
    navigate("/manutencoes-patrimonios");
  };

   if (!maintenance) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Manutenção" description="Editar Manutenção" />
        <PageBreadcrumb pageTitle="Editar Manutenção" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormPatrimonyMaintenance initialData={maintenance} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
