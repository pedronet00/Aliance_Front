import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormLocation, { LocationFormData } from "../Forms/FormLocation";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function LocationEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Location/${guid}`).then((res) => {
      setLocation(res.data);
    });
  }, [guid]);

  const handleSubmit = async (data: LocationFormData) => {
    await apiClient.put(`/Location`, data);
    showEditedSuccessfullyToast();
    navigate("/locais");
  };

   if (!location) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Local" description="Editar Local" />
        <PageBreadcrumb
          items={[
            { label: "Início", path: "/" },
            { label: "Locais", path: "/locais" },
            { label: "Editar Local", path: `/locais/editar/${guid}` },
          ]}
        />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormLocation initialData={location} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
