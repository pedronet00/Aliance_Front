import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CostCenter } from "@/types/CostCenter/CostCenter";
import { AccountPayableDTO } from "@/types/AccountPayable/AccountPayableDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: AccountPayableDTO;
  onSubmit: (data: AccountPayableDTO) => Promise<void>;
};

// Estado do form usa costCenterId como string para evitar problemas de tipo com Select
type FormState = Omit<AccountPayableDTO, "costCenterId"> & {
  costCenterId: string;
  isPaid: boolean;
};

export default function FormAccountPayable({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormState>(() => ({
    description: initialData?.description ?? "",
    amount: initialData?.amount ?? 0,
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
    paymentDate: initialData?.paymentDate
      ? new Date(initialData.paymentDate)
      : new Date(),
    accountStatus: initialData?.accountStatus ?? "Pendente",
    branchId: user?.branchId,
    costCenterId: initialData?.costCenterId ? String(initialData.costCenterId) : "",
    isPaid: initialData?.paymentDate ? true : false, // define flag automaticamente se já existir data
  }));

  const [costCenterOptions, setCostCenterOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    apiClient
      .get<CostCenter[]>("/CostCenter/active")
      .then((res) => {
        const options = res.data.result.map((cc) => ({
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

    const payload: AccountPayableDTO = {
      description: formData.description,
      amount: formData.amount,
      dueDate: formData.dueDate,
      branchId: user?.branchId,
      paymentDate: formData.isPaid ? formData.paymentDate : null, // envia nulo se não estiver pago
      accountStatus: formData.isPaid ? "Paga" : "Pendente",
      costCenterId: Number(formData.costCenterId),
    };

    await onSubmit(payload);
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
        <Label>Data de Vencimento</Label>
        <Input
          type="date"
          value={formData.dueDate.toISOString().substring(0, 10)}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: new Date(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Centro de Custo</Label>
        <Select
          options={costCenterOptions}
          placeholder="Selecione um centro de custo"
          value={formData.costCenterId}
          onChange={(val: any) => {
            const newVal =
              typeof val === "string" ? val : (val?.value ?? "");
            setFormData((prev) => ({ ...prev, costCenterId: newVal }));
          }}
        />
      </div>

      {/* Flag de conta paga */}
      <div className="flex items-center space-x-2">
        <input
          id="isPaid"
          type="checkbox"
          checked={formData.isPaid}
          onChange={(e) =>
            setFormData({ ...formData, isPaid: e.target.checked })
          }
        />
        <Label htmlFor="isPaid">Conta já foi paga</Label>
      </div>

      {/* Campo condicional */}
      {formData.isPaid && (
        <div>
          <Label>Data de Pagamento</Label>
          <Input
            type="date"
            value={formData.paymentDate.toISOString().substring(0, 10)}
            onChange={(e) =>
              setFormData({ ...formData, paymentDate: new Date(e.target.value) })
            }
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
