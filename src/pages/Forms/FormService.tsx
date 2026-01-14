import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import apiClient from "@/api/apiClient";
import { ServiceDTO } from "@/types/Service/ServiceDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: ServiceDTO;
  onSubmit: (data: ServiceDTO) => Promise<void>;
};

export default function FormService({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();

  const [formData, setFormData] = useState<ServiceDTO>(() => {
    if (initialData) {
      return {
        ...initialData,
        date: new Date(initialData.date),
        churchId: user?.churchId ?? 0,
        branchId: user?.branchId,
      };
    }

    return {
      id: 0,
      guid: "", // não será enviado no payload
      date: new Date(),
      status: "Agendado",
      locationId: 0,
      churchId: user?.churchId ?? 0,
      branchId: user?.branchId,
    };
  });

  const [locations, setLocations] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await apiClient.get("/Location/active");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.result ?? [];

        setLocations(
          data.map((l: any) => ({ value: Number(l.id), label: l.name }))
        );

        if (!initialData && data.length > 0) {
          setFormData((prev) => ({ ...prev, locationId: data[0].id }));
        }
      } catch (err) {
        console.error("Erro ao carregar locais:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [initialData]);

  function formatDateTimeLocal(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes())
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const pad = (n: number) => n.toString().padStart(2, "0");
  const date = formData.date;
  const payload: ServiceDTO = {
    id: formData.id,
    date:
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()),
    status: formData.status,
    locationId: formData.locationId,
    churchId: formData.churchId,
    guid: undefined as any,
    branchId: user?.branchId,
  };

  await onSubmit(payload);
};


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Data */}
      <div>
        <Label>Data do Culto</Label>
        <Input
          type="datetime-local"
          value={
            formData.date ? formatDateTimeLocal(new Date(formData.date)) : ""
          }
          onChange={(e) =>
            setFormData({ ...formData, date: new Date(e.target.value) })
          }
        />
      </div>

      {/* Local */}
      <div>
        <Label>Local</Label>
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
