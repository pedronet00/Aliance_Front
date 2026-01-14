import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { BudgetDTO } from "@/types/Budget/BudgetDTO";
import { CostCenter } from "@/types/CostCenter/CostCenter";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: BudgetDTO;
  onSubmit: (data: BudgetDTO) => Promise<void>;
};

export default function FormBudget({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BudgetDTO>(() => {
    if (initialData) {
      return {
        ...initialData,
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : new Date(),
        endDate: initialData.endDate
          ? new Date(initialData.endDate)
          : new Date(),
        branchId: user?.branchId,
        costCenterId: initialData.costCenterId ?? 0,
      };
    }

    return {
      name: "",
      description: "",
      totalAmount: null,
      startDate: new Date(),
      endDate: new Date(),
      branchId: user?.branchId,
      status: "PendenteAprovacao",
      costCenterId: 0,
      churchId: user?.churchId ?? 0,
    };
  });

  const [costCentersOptions, setCostCentersOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    apiClient
      .get<CostCenter[]>("/CostCenter/active")
      .then((res) => {
        const options = res.data.result.map((f) => ({
          value: String(f.id),
          label: f.name,
        }));
        setCostCentersOptions(options);

        // Se houver initialData e costCenterId, garante que o Select reconheça
        if (initialData?.costCenterId) {
          setFormData((prev) => ({
            ...prev,
            costCenterId: initialData.costCenterId,
          }));
        }
      })
      .catch((err) => console.error("Erro ao carregar centros de custo", err));
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <TextArea
          placeholder="Insira a descrição do orçamento"
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
        />
      </div>

      <div>
        <Label>Total</Label>
        <Input
          type="number"
          value={formData.totalAmount ?? ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalAmount: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>

      <div>
        <Label>Data de Início</Label>
        <Input
          type="date"
          value={
            formData.startDate
              ? new Date(formData.startDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, startDate: new Date(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Data de Término</Label>
        <Input
          type="date"
          value={
            formData.endDate
              ? new Date(formData.endDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, endDate: new Date(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Centro de Custo</Label>
        <Select
          options={costCentersOptions}
          placeholder="Selecione um centro de custo"
          value={formData.costCenterId ? String(formData.costCenterId) : ""}
          onChange={(val) =>
            setFormData({ ...formData, costCenterId: Number(val) })
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
