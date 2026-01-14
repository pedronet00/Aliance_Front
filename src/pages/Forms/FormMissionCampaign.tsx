import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import useGoBack from "@/hooks/useGoBack";
import { MissionCampaignDTO } from "@/types/Mission/MissionCampaignDTO";

type Props = {
  initialData?: MissionCampaignDTO;
  onSubmit: (data: MissionCampaignDTO) => Promise<void>;
};

// Converte data para yyyy-MM-dd (necessário para <input type="date" />)
function formatDate(date: string | Date) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function FormMissionCampaign({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<MissionCampaignDTO>(
    initialData
      ? {
          ...initialData,
          startDate: formatDate(initialData.startDate),
          endDate: formatDate(initialData.endDate),
          collectedAmount: initialData.collectedAmount ?? 0,
          branchId: user?.branchId,
        }
      : {
          name: "",
          type: "",
          startDate: formatDate(new Date()),
          endDate: formatDate(new Date()),
          targetAmount: 0,
          collectedAmount: 0,
          churchId: user?.churchId,
          branchId: user?.branchId,
        }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // collectedAmount é sempre controlado no backend
      const dataToSubmit = { ...formData, collectedAmount: 0 };
      await onSubmit(dataToSubmit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <Label>Nome da Campanha</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Campanha Missionária 2025"
        />
      </div>

      <div>
        <Label>Tipo</Label>
        <Select
          options={[
            { value: "Municipal", label: "Municipal" },
            { value: "Regional", label: "Regional" },
            { value: "Estadual", label: "Estadual" },
            { value: "Nacional", label: "Nacional" },
            { value: "Mundial", label: "Mundial" },
          ]}
          placeholder="Selecione o tipo"
          value={formData.type}
          onChange={(value) => setFormData({ ...formData, type: value })}
        />
      </div>

      <div>
        <Label>Data de Início</Label>
        <Input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
      </div>

      <div>
        <Label>Data de Término</Label>
        <Input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>

      <div>
        <Label>Meta da Campanha</Label>
        <Input
          type="number"
          value={formData.targetAmount}
          onChange={(e) =>
            setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })
          }
          placeholder="Ex: 5000.00"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
