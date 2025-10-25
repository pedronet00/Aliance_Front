import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ExpenseDTO } from "@/types/Expense/ExpenseDTO";
import useGoBack from "@/hooks/useGoBack";

export type ExpenseFormData = ExpenseDTO;

type Props = {
  initialData?: ExpenseDTO;
  onSubmit: (data: ExpenseDTO) => Promise<void>;
};

export default function FormExpense({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExpenseDTO>({
    description: "",
    amount: 0,
    date: new Date(),
    category: "",
    churchId: user?.churchId ?? 0,
  });

  // aplica initialData se vier depois do carregamento inicial
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        churchId: user?.churchId ?? prev.churchId,
      }));
    }
  }, [initialData, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
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
          placeholder="Ex: Dízimo de João"
        />
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          placeholder="Ex: 250.00"
        />
      </div>

      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={
            typeof formData.date === "string"
              ? formData.date
              : formData.date.toISOString().split("T")[0]
          }
          onChange={(e) =>
            setFormData({ ...formData, date: new Date(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Categoria</Label>
        <Select
          options={[
            { value: 1, label: "Salário" },
            { value: 3, label: "Insumos" },
            { value: 4, label: "Tecnologia" },
            { value: 5, label: "Produtos" },
            { value: 6, label: "Serviços" },
            { value: 7, label: "Outro" },
          ]}
          placeholder="Selecione a categoria"
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
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
