import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormCostCenter, { CostCenterFormData } from "../Forms/FormCostCenter";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function CostCenterEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<CostCenterFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/CostCenter/${id}`).then((res) => {
      setCenter(res.data.result);
    });
  }, [id]);

  const handleSubmit = async (data: CostCenterFormData) => {
    await apiClient.put(`/CostCenter/${id}`, data);
    showEditedSuccessfullyToast();
    navigate("/centros-de-custo");
  };

   if (!center) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Centro de Custo" description="Editar Centro de Custo" />
        <PageBreadcrumb pageTitle="Editar Centro de Custo" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormCostCenter initialData={center} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
