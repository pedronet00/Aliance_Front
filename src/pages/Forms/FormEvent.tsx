import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { EventDTO } from "@/types/Event/EventDTO";
import apiClient from "@/api/apiClient";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: EventDTO;
  onSubmit: (data: EventDTO) => Promise<void>;
};

export default function FormEvent({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const goBack = useGoBack();
  const [formData, setFormData] = useState<EventDTO>(
    initialData ?? {
      name: "",
      description: "",
      date: initialData?.date
        ? initialData.date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      cost: 0,
      locationId: 0,
      costCenterId: 0,
      churchId: user?.churchId ?? 0,
      branchId: user?.branchId,
    }
  );

  const [locations, setLocations] = useState<{ value: number; label: string }[]>([]);
  const [costCenters, setCostCenters] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [locsRes, costCentersRes] = await Promise.all([
        apiClient.get("/Location/active"),
        apiClient.get("/CostCenter/active"),
      ]);

      // trata ambos os formatos (objeto com "result" e array direto)
      const locationData = Array.isArray(locsRes.data)
        ? locsRes.data
        : locsRes.data ?? [];

      const costCenterData = Array.isArray(costCentersRes.data.items)
        ? costCentersRes.data.items
        : costCentersRes.data.result ?? [];

      const locationList = locationData.map((l: any) => ({
        value: Number(l.id),
        label: l.name,
      }));

      const costCenterList = costCenterData.map((c: any) => ({
        value: Number(c.id),
        label: c.name,
      }));

      setLocations(locationList);
      setCostCenters(costCenterList);

      if (initialData) {
        setFormData((prev) => ({
          ...prev,
          locationId: initialData.locationId ?? locationList[0]?.value ?? 0,
          costCenterId: initialData.costCenterId ?? costCenterList[0]?.value ?? 0,
          date: initialData.date
            ? initialData.date.split("T")[0]
            : new Date().toISOString().split("T")[0],
          churchId: initialData.churchId ?? user?.churchId ?? 0,
          branchId: user?.branchId,
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do formulário:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [initialData]);


  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div>
        <Label>Nome</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Retiro Espiritual"
        />
      </div>

      {/* Descrição */}
      <div>
        <Label>Descrição</Label>
        <Input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ex: Evento de integração da igreja"
        />
      </div>

      {/* Data */}
      <div>
        <Label>Data</Label>
        <Input
          type="datetime-local"
          value={
            typeof formData.date === "string"
              ? formData.date
              : formData.date.toISOString().split("T")[0]
          }
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {/* Custo */}
      <div>
        <Label>Custo</Label>
        <Input
          type="number"
          value={formData.cost}
          onChange={(e) =>
            setFormData({ ...formData, cost: parseFloat(e.target.value) })
          }
          placeholder="Ex: 150.00"
        />
      </div>

      {/* Local */}
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

      {/* Centro de Custo */}
      <div>
        <Label>Centro de Custo</Label>
        <select
          className="border border-gray-300 rounded p-2 w-full"
          value={formData.costCenterId || ""}
          onChange={(e) =>
            setFormData({ ...formData, costCenterId: Number(e.target.value) })
          }
        >
          <option value="">Selecione o centro de custo</option>
          {costCenters.map((cc) => (
            <option key={cc.value} value={cc.value}>
              {cc.label}
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
