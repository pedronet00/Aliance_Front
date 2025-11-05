import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useParams } from "react-router";
import useGoBack from "@/hooks/useGoBack";

export interface WorshipTeamRehearsalDTO {
  id: number;
  guid?: string;
  rehearsalDate: string; // formato "YYYY-MM-DDTHH:mm"
  worshipTeamId: string;
  status: string;
}

type Props = {
  initialData?: WorshipTeamRehearsalDTO;
  onSubmit: (data: WorshipTeamRehearsalDTO) => Promise<void>;
};

export default function FormWorshipTeamRehearsal({
  initialData,
  onSubmit,
}: Props) {
  const { guidEquipe } = useParams<{ guidEquipe: string }>();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);

  // 🔹 valor inicial sem conversão de fuso
  const getInitialDateTime = () => {
    if (initialData?.rehearsalDate) {
      return initialData.rehearsalDate.slice(0, 16);
    }
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    id: initialData?.id ?? 0,
    guid: initialData?.guid ?? "",
    rehearsalDate: getInitialDateTime(),
    worshipTeamId: initialData?.worshipTeamId ?? "",
    status: initialData?.status ?? "Agendado",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: WorshipTeamRehearsalDTO = {
      id: formData.id,
      rehearsalDate: formData.rehearsalDate,
      worshipTeamId: guidEquipe,
      status: formData.status,
      ...(formData.guid && { guid: formData.guid }), // só adiciona se houver valor
    };


    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Data e hora do ensaio</Label>
        <Input
          type="datetime-local"
          value={formData.rehearsalDate}
          onChange={(e) =>
            setFormData({ ...formData, rehearsalDate: e.target.value })
          }
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
