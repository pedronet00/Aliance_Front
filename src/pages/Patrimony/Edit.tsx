import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormPatrimony, { PatrimonyFormData } from "../Forms/FormPatrimony";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function PatrimonyEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [patrimony, setPatrimony] = useState<PatrimonyFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Patrimony/${guid}`).then((res) => {
      setPatrimony(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: PatrimonyFormData) => {
    await apiClient.put(`/Patrimony`, data);
    showEditedSuccessfullyToast();
    navigate("/patrimonios");
  };

   if (!patrimony) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Departamento" description="Editar Departamento" />
        <PageBreadcrumb pageTitle="Editar Departamento" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormPatrimony initialData={patrimony} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
