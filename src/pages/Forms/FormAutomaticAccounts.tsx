import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CostCenter } from "@/types/CostCenter/CostCenter";
import { AutomaticAccountsDTO } from "@/types/AutomaticAccounts/AutomaticAccountsDTO";
import useGoBack from "@/hooks/useGoBack";
import { useAuth } from "@/context/AuthContext";

type Props = {
  initialData?: AutomaticAccountsDTO;
  onSubmit: (data: AutomaticAccountsDTO) => Promise<void>;
};

type FormState = Omit<AutomaticAccountsDTO, "costCenterId"> & {
  costCenterId: string;
};

export default function FormAutomaticAccount({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>(() => ({
    description: initialData?.description ?? "",
    amount: initialData?.amount ?? 0,
    dueDay: initialData?.dueDay ?? 1,
    accountType: initialData?.accountType ?? "payable",
    costCenterId: initialData?.costCenterId ? String(initialData.costCenterId) : "",
    churchId: user?.churchId
  }));

  const [costCenterOptions, setCostCenterOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    apiClient
      .get<CostCenter[]>("/CostCenter/paged?pageNumber=1&pageSize=1000")
      .then((res) => {
        const options = res.data.items.map((cc) => ({
          value: String(cc.id),
          label: cc.name,
        }));
        setCostCenterOptions(options);
      })
      .catch((err) => console.error("Erro ao carregar centros de custo", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.costCenterId) {
      alert("Selecione um Centro de Custo.");
      return;
    }

    const payload: AutomaticAccountsDTO = {
      description: formData.description,
      amount: formData.amount,
      dueDay: formData.dueDay,
      accountType: formData.accountType,
      costCenterId: Number(formData.costCenterId),
      churchId: formData.churchId
    };

    await onSubmit(payload);

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <Label>Descrição</Label>
        <Input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value || "0") })
          }
        />
      </div>

      <div>
        <Label>Dia de Vencimento</Label>
        <Input
          type="number"
          min={1}
          max={31}
          value={formData.dueDay}
          onChange={(e) =>
            setFormData({ ...formData, dueDay: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Tipo da Conta</Label>
        <Select
          options={[
            { value: "receivable", label: "A Receber" },
            { value: "payable", label: "A Pagar" },
          ]}
          value={formData.accountType}
          onChange={(val: any) =>
            setFormData({ ...formData, accountType: val?.value ?? val })
          }
        />
      </div>

      <div>
        <Label>Centro de Custo</Label>
        <Select
          options={costCenterOptions}
          placeholder="Selecione um centro de custo"
          value={formData.costCenterId}
          onChange={(val: any) =>
            setFormData({ ...formData, costCenterId: val?.value ?? val })
          }
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="button" variant="secondary" onClick={() => goBack()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
