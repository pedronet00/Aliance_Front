import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormCell, { CellFormData } from "../Forms/FormCell";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function CellEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<CellFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Cell/${guid}`).then((res) => {
      setCenter(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: CellFormData) => {
    await apiClient.put(`/Cell/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/celulas");
  };

   if (!center) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Célula" description="Editar Célula" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Células", path: "/celulas" },
            { label: "Editar Célula", path: `/celulas/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormCell initialData={center} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
