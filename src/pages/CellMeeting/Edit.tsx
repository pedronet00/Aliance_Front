import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormCellMeeting, { CellMeetingFormData } from "../Forms/FormCellMeeting";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function CellMeetingEdit() {
  const { guidEncontro } = useParams();
  const { guidCelula } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<CellMeetingFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/CellMeeting/meeting/${guidEncontro}`).then((res) => {
      setMeeting(res.data);
    });
  }, [guidEncontro]);

  const handleSubmit = async (data: CellMeetingFormData) => {
    await apiClient.put(`/CellMeeting`, data);
    showEditedSuccessfullyToast();
    navigate(`/celulas/${guidCelula}/encontros`);
  };

   if (!meeting) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Encontro" description="Editar Encontro" />
        <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Células", path: "/celulas" },
          { label: "Encontros da Célula", path: `/celulas/${guidCelula}/encontros` },
          { label: "Editar Encontro da Célula", path: `/celulas/${guidCelula}/encontros/${guidEncontro}/editar` },
        ]}
      />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormCellMeeting initialData={meeting} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
