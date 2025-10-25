import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { IncomeDTO } from "@/types/Income/IncomeDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: IncomeDTO;
  onSubmit: (data: IncomeDTO) => Promise<void>;
};

export default function FormIncome({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<IncomeDTO>(
    initialData ?? {
      description: "",
      amount: 0,
      date: new Date(),
      category: "",
      churchId: user?.churchId ?? 0
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Descrição */}
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

      {/* Valor */}
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

      {/* Data */}
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

      {/* Categoria */}
      <div>
        <Label>Categoria</Label>
        <Select
          options={[
            { value: "Dizimo", label: "Dízimo" },
            { value: "Oferta", label: "Oferta" },
            { value: "Doacao", label: "Doação" },
            { value: "Evento", label: "Evento" },
            { value: "Outro", label: "Outro" },
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
