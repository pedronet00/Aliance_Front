import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormEvent, { EventFormData } from "../Forms/FormEvent";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function EventEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<EventFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Event/${guid}`).then((res) => {
      setVisit(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: EventFormData) => {
    await apiClient.put(`/Event`, data);
    showEditedSuccessfullyToast();
    navigate("/eventos");
  };

   if (!visit) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Evento" description="Editar Evento" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Eventos", path: "/eventos" },
            { label: "Editar Evento", path: `/eventos/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormEvent initialData={visit} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
