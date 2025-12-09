import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormMission from "../Forms/FormMission";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { MissionDTO } from "@/types/Mission/MissionDTO";

export default function MissionEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState<MissionDTO | null>(null);

  useEffect(() => {
    apiClient.get(`/Mission/${guid}`).then((res) => {
      setMission(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: MissionDTO) => {
    await apiClient.put(`/Mission`, data);
    showEditedSuccessfullyToast();
    navigate("/missoes");
  };

  if (!mission) return <LoadingSpinner />;

  return (
    <>
      <PageMeta title="Editar Missão" description="Editar Missão" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Missões", path: "/missoes" },
          { label: "Editar Missão", path: `/missoes/editar/${guid}` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="">
          <FormMission initialData={mission} onSubmit={handleSubmit} />
        </ComponentCard>
      </div>
    </>
  );
}
