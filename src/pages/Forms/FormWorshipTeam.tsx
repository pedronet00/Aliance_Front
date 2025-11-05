import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { WorshipTeamDTO } from "@/types/WorshipTeam/WorshipTeamDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: WorshipTeamDTO;
  onSubmit: (data: WorshipTeamDTO) => Promise<void>;
};

export default function FormWorshipTeam({ initialData, onSubmit }: Props) {

    const {user} = useAuth();
    const goBack = useGoBack();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<WorshipTeamDTO>(
        initialData ?? {
        name: "",
        status: true,
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
      <div>
        <Label>Nome do grupo</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
