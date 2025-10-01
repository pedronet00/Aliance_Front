import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormDepartment, { DepartmentFormData } from "../Forms/FormDepartment";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function DepartmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<DepartmentFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Department/${id}`).then((res) => {
      setCenter(res.data.result);
    });
  }, [id]);

  const handleSubmit = async (data: DepartmentFormData) => {
    await apiClient.put(`/Department`, data);
    showEditedSuccessfullyToast();
    navigate("/departamentos");
  };

   if (!center) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Departamento" description="Editar Departamento" />
        <PageBreadcrumb pageTitle="Editar Departamento" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormDepartment initialData={center} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
