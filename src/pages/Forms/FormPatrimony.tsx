import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { PatrimonyDTO } from "@/types/Department/PatrimonyDTO";
import Select from "@/components/form/Select";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: PatrimonyDTO;
  onSubmit: (data: PatrimonyDTO) => Promise<void>;
};

export default function FormPatrimony({ initialData, onSubmit }: Props) {

    const {user} = useAuth();
    const goBack = useGoBack();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<PatrimonyDTO>(
        initialData ?? {
        name: "",
        description: "",
        unitValue: 0,
        quantity: 0,
        totalValue: 0,
        acquisitionDate: "",
        condition: "",
        churchId: user?.churchId ?? 0
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      await onSubmit({
      ...formData,
      totalValue: formData.unitValue * formData.quantity
      });
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome do patrimônio</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Descrição</Label>
        <Input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

        <div>
        <Label>Valor Unitário</Label>
        <Input
          type="number"
          value={formData.unitValue}
          onChange={(e) => setFormData({ ...formData, unitValue: parseFloat(e.target.value) })}
        />
      </div>

        <div>
        <Label>Quantidade</Label>
        <Input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
        />
      </div>

        <div>
        <Label>Data de Aquisição</Label>
        <Input
          type="date"
          value={formData.acquisitionDate}
          onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
        />
      </div>

        <div>
        <Label>Condição</Label>
        <Select
          options={[
            { value: 'Novo', label: 'Novo' },
            { value: 'Bom', label: 'Bom' },
            { value: 'Usado', label: 'Usado' },
            { value: 'Ruim', label: 'Ruim' },
            { value: 'Danificado', label: 'Danificado' },
          ]}
          placeholder="Selecione a condição"
          value={formData.condition}
          onChange={(value) => setFormData({ ...formData, condition: value })}
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
