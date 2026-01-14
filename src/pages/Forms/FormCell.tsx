import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CellDTO } from "@/types/Cell/CellDTO";
import { useAuth } from "@/context/AuthContext";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: CellDTO;
  onSubmit: (data: CellDTO) => Promise<void>;
};

const WEEKDAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function FormCell({ initialData, onSubmit }: Props) {
  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>([]);
  const [locations, setLocations] = useState<{ value: number; label: string }[]>([]);
  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name ?? "",
    locationId: initialData?.locationId ?? 0,
    leaderId: initialData?.leaderId ?? "",
    branchId: user?.branchId,
    meetingDay: initialData?.meetingDay ?? "",
    churchId: user?.churchId ?? 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, locsRes] = await Promise.all([
          apiClient.get("/User/active"),
          apiClient.get("/Location/active"),
        ]);

        const userList = usersRes.data.result.map((u: any) => ({
          value: u.id, // GUID string
          label: u.fullName,
        }));

        const locationList = locsRes.data.map((l: any) => ({
          value: Number(l.id), // número
          label: l.name,
        }));

        setLeaders(userList);
        setLocations(locationList);

        // Preenche selects se já houver dados iniciais
        if (initialData) {
          setFormData((prev) => ({
            ...prev,
            leaderId: initialData.leaderId ?? userList[0]?.value ?? "",
            locationId: initialData.locationId ?? locationList[0]?.value ?? 0,
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do formulário", err);
      }
    };

    fetchData();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const payload: CellDTO = {
      name: formData.name.trim(),
      locationId: Number(formData.locationId),
      leaderId: formData.leaderId, 
      meetingDay: String(formData.meetingDay),
      churchId: user?.churchId ?? 0,
      branchId: user?.branchId,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome da Célula</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Dia da Reunião</Label>
        <Select
          options={WEEKDAYS}
          placeholder="Selecione o dia"
          value={formData.meetingDay}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, meetingDay: value });
          }}
        />
      </div>

      <div>
        <Label>Líder</Label>
        <Select
          options={leaders}
          placeholder="Selecione o líder"
          value={formData.leaderId}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, leaderId: value });
          }}
        />
      </div>

      <div>
        <Label>Localização</Label>
        <select
          className="border border-gray-300 rounded p-2 w-full"
          value={formData.locationId || ""}
          onChange={(e) =>
            setFormData({ ...formData, locationId: Number(e.target.value) })
          }
        >
          <option value="">Selecione o local</option>
          {locations.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
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
