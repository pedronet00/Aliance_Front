import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormSundaySchoolClass, { SundaySchoolClassFormData } from "../Forms/FormSundaySchoolClass";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function SundaySchoolClassEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState<SundaySchoolClassFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/SundaySchoolClass/${guid}`).then((res) => {
      setCenter(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: SundaySchoolClassFormData) => {
    await apiClient.put(`/SundaySchoolClass`, data);
    showEditedSuccessfullyToast();
    navigate("/aulas-ebd");
  };

   if (!center) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Aula de EBD" description="Editar Aula de EBD" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Aulas de EBD", path: "/aulas-ebd" },
            { label: "Editar Aula de EBD", path: `/aulas-ebd/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormSundaySchoolClass initialData={center} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
