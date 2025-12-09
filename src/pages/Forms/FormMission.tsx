import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { MissionDTO } from "@/types/Mission/MissionDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: MissionDTO;
  onSubmit: (data: MissionDTO) => Promise<void>;
};

export default function FormMission({ initialData, onSubmit }: Props) {

  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<MissionDTO>(
    initialData ?? {
      name: "",
      city: "",
      state: "",
      status: true,
      churchId: user?.churchId ?? 0,
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
        <Label>Nome da missão</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Cidade</Label>
        <Input
          type="text"
          value={formData.city}
          onChange={(e) =>
            setFormData({ ...formData, city: e.target.value })
          }
        />
      </div>

      <div>
        <Label>Estado</Label>
        <Input
          type="text"
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => goBack()}
          >
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
