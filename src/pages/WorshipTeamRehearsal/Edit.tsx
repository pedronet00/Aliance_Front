import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormWorshipTeamRehearsal, { WorshipTeamRehearsalFormData } from "../Forms/FormWorshipTeamRehearsal";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function WorshipTeamRehearsalEdit() {
  const { guidEnsaio } = useParams();
  const { guidEquipe } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<WorshipTeamRehearsalFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/WorshipTeamRehearsal/rehearsal/${guidEnsaio}`).then((res) => {
      setMeeting(res.data);
    });
  }, [guidEnsaio]);

  const handleSubmit = async (data: WorshipTeamRehearsalFormData) => {
    await apiClient.put(`/WorshipTeamRehearsal`, data);
    showEditedSuccessfullyToast();
    navigate(`/grupos-de-louvor/${guidEquipe}/ensaios`);
  };

   if (!meeting) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Ensaio" description="Editar Ensaio" />
        <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Grupos de louvor", path: "/grupos-de-louvor" },
          { label: "Ensaios do Grupo", path: `/grupos-de-louvor/${guidEquipe}/ensaios` },
          { label: "Editar Ensaio do Grupo", path: `/grupos-de-louvor/${guidEquipe}/ensaios/${guidEnsaio}/editar` },
        ]}
      />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormWorshipTeamRehearsal initialData={meeting} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
