import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CellMeetingDTO } from "@/types/Cell/CellMeetingDTO";
import { useParams } from "react-router";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: CellMeetingDTO;
  onSubmit: (data: CellMeetingDTO) => Promise<void>;
};

export default function FormCellMeeting({ initialData, onSubmit }: Props) {
  const { guidCelula } = useParams<{ guidCelula: string }>();

  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);
  const [leaders, setLeaders] = useState<{ value: string; label: string }[]>([]);
  const [locations, setLocations] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState<CellMeetingDTO>({
    id: initialData?.id ?? 0,
    guid: initialData?.guid ?? "", // GUID do CellMeeting (para update)
    theme: initialData?.theme ?? "",
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    status: initialData?.status ?? "Agendado",
    leaderGuid: initialData?.leaderGuid ?? "",
    locationGuid: initialData?.locationGuid ?? "",
    cellGuid: initialData?.cellGuid ?? guidCelula ?? "",
  });

  // 🔹 Carrega líderes e locais
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, locsRes] = await Promise.all([
          apiClient.get("/User"),
          apiClient.get("/Location"),
        ]);

        const userList = usersRes.data.result.map((u: any) => ({
          value: u.guid ?? u.id,
          label: u.userName,
        }));

        const locationList = locsRes.data.result.map((l: any) => ({
          value: l.guid,
          label: l.name,
        }));

        setLeaders(userList);
        setLocations(locationList);

        // Preenche selects e campos do form se já tiver initialData
        if (initialData) {
          setFormData((prev) => ({
            ...prev,
            theme: initialData.theme ?? prev.theme,
            date: initialData.date ? new Date(initialData.date) : prev.date,
            leaderGuid: initialData.leaderGuid ?? userList[0]?.value ?? "",
            locationGuid: initialData.locationGuid ?? locationList[0]?.value ?? "",
          }));
        }
      } catch (err) {
        console.error("Erro ao carregar dados do formulário", err);
      }
    };

    fetchData();
  }, [initialData]);

  // 🔹 Envia todos os campos necessários
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const payload: CellMeetingDTO = {
      guid: formData.guid, // mesmo que vazio, backend decide criar ou atualizar
      cellGuid: formData.cellGuid,
      leaderGuid: formData.leaderGuid,
      locationGuid: formData.locationGuid,
      date: formData.date,
      theme: formData.theme,
      status: formData.status,
      id: formData.id,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Tema</Label>
        <Input
          type="text"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
        />
      </div>

      <div>
        <Label>Data do Encontro</Label>
        <Input
          type="datetime-local"
          value={formData.date.toISOString().slice(0, 16)}
          onChange={(e) =>
            setFormData({ ...formData, date: new Date(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Líder</Label>
        <Select
          options={leaders}
          placeholder="Selecione o líder"
          value={formData.leaderGuid}
          onChange={(val: any) => {
            const value = typeof val === "string" ? val : val?.value ?? "";
            setFormData({ ...formData, leaderGuid: value });
          }}
        />
      </div>

      <div>
        <Label>Localização</Label>
        <Select
          options={locations}
          placeholder="Selecione o local"
          value={formData.locationGuid}
          onChange={(val: any) => {
            const value = typeof val === "string" ? val : val?.value ?? "";
            setFormData({ ...formData, locationGuid: value });
          }}
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
