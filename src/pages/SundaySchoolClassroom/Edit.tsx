import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormSundaySchoolClassroom, { SundaySchoolClassroomFormData } from "../Forms/FormSundaySchoolClassroom";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function SundaySchoolClassroomEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState<SundaySchoolClassroomFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/SundaySchoolClassroom/${guid}`).then((res) => {
      setClassroom(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: SundaySchoolClassroomFormData) => {
    await apiClient.put(`/SundaySchoolClassroom/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/classes-ebd");
  };

   if (!classroom) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Local" description="Editar Local" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Classes de EBD", path: "/classes-ebd" },
            { label: "Editar Classe de EBD", path: `/classes-ebd/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormSundaySchoolClassroom initialData={classroom} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
