import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormBranch from "../Forms/FormBranch";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { BranchDTO } from "@/types/Branch/BranchDTO";

export default function BranchEdit() {
  const { guid } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<BranchDTO | null>(null);

  useEffect(() => {
    apiClient.get(`/Branch/${guid}`).then((res) => {
      setBranch(res.data.result);
    });
  }, [guid]);

  const handleSubmit = async (data: BranchDTO) => {
    await apiClient.put(`/Branch/${guid}`, data);
    showEditedSuccessfullyToast();
    navigate("/filiais");
  };

  if (!branch) return <LoadingSpinner />;

  return (
    <>
      <PageMeta title="Editar Filial" description="Editar Filial" />

      <PageBreadcrumb
        items={[
          { label: "Início", path: "/" },
          { label: "Missões", path: "/missoes" },
          { label: "Editar Filial", path: `/filiais/editar/${guid}` },
        ]}
      />

      <div className="space-y-6">
        <ComponentCard title="">
          <FormBranch initialData={branch} onSubmit={handleSubmit} />
        </ComponentCard>
      </div>
    </>
  );
}
