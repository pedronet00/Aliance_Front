import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormService, { ServiceFormData } from "../Forms/FormService";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function ServiceEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Service/${guid}`).then((res) => {
      setService(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: ServiceFormData) => {
    await apiClient.put(`/Service`, data);
    showEditedSuccessfullyToast();
    navigate("/cultos");
  };

   if (!service) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Culto" description="Editar Culto" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Cultos", path: "/cultos" },
            { label: "Editar Culto", path: `/cultos/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormService initialData={service} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
