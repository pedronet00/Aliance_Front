import apiClient from "@/api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormBudget, { BudgetFormData } from "../Forms/FormBudget";
import { showEditedSuccessfullyToast } from "@/components/toast/Toasts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export default function BudgetEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState<BudgetFormData | null>(null);

  useEffect(() => {
    apiClient.get(`/Budget/${id}`).then((res) => {
      setBudget(res.data.result);
    });
  }, [id]);

  const handleSubmit = async (data: BudgetFormData) => {
    await apiClient.put(`/Budget`, data);
    showEditedSuccessfullyToast();
    navigate("/orcamentos");
  };

   if (!budget) return <LoadingSpinner/>;

  return (
    <>
        <PageMeta title="Editar Orçamento" description="Editar Orçamento" />
        <PageBreadcrumb pageTitle="Editar Orçamento" />
            <div className="space-y-6">
                <ComponentCard title="">
                    <FormBudget initialData={budget} onSubmit={handleSubmit} />
                </ComponentCard>
            </div>
    </>
  );
}
