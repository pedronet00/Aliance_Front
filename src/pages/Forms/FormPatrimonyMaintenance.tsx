import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { PatrimonyMaintenanceDTO } from "@/types/PatrimonyMaintenance/PatrimonyMaintenanceDTO";
import { Department } from "@/types/Department/Department";
import { Patrimony } from "@/types/Patrimony/Patrimony";

type Props = {
  initialData?: PatrimonyMaintenanceDTO;
  onSubmit: (data: PatrimonyMaintenanceDTO) => Promise<void>;
};

export default function FormPatrimonyMaintenance({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PatrimonyMaintenanceDTO>(() => {
  if (initialData) {
    return {
      ...initialData,
      patrimonyId: String(initialData.patrimonyId ?? ""),
      churchId: user?.churchId ?? 0,
    };
  }

  return {
    description: "",
    maintenanceDate: new Date(),
    patrimonyId: "",
    churchId: user?.churchId ?? 0,
  };
});

  const [patrimonyOptions, setPatrimonyOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Carrega os centros de custo e ajusta o formData se estiver editando
  useEffect(() => {
  apiClient
    .get<Patrimony[]>("/Patrimony")
    .then((res) => {
      const options = res.data.map((f) => ({
        value: String(f.id),
        label: f.name,
      }));
      setPatrimonyOptions(options);

      if (initialData?.patrimonyId) {
        setFormData((prev) => ({
          ...prev,
          patrimonyId: String(initialData.patrimonyId), // garante string
        }));
      }

    })
    .catch((err) => console.error("Erro ao carregar patrimônios", err));
}, [initialData]);


useEffect(() => {
  if (user?.churchId) {
    setFormData((prev) => ({
      ...prev,
      churchId: user.churchId, // agora garante que vem atualizado
    }));
  }
}, [user]); // importante: depende do user

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await onSubmit({
    ...formData,
    patrimonyId: Number(formData.patrimonyId),
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      

      <div>
        <Label>Patrimônio</Label>
        <Select
        options={patrimonyOptions}
        placeholder="Selecione um patrimônio"
        value={formData.patrimonyId}
        onChange={(val) =>
            setFormData({ ...formData, patrimonyId: val })
        }
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
        <Label>Data de Manutenção</Label>
        <Input
          type="date"
          value={formData.maintenanceDate ? new Date(formData.maintenanceDate).toISOString().split('T')[0] : ''}
          onChange={(e) => setFormData({ ...formData, maintenanceDate: new Date(e.target.value) })}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
