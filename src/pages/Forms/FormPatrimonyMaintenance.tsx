import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { PatrimonyMaintenanceDTO } from "@/types/PatrimonyMaintenance/PatrimonyMaintenanceDTO";
import { Patrimony } from "@/types/Patrimony/Patrimony";
import { CostCenter } from "@/types/CostCenter/CostCenter";

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
        costCenterId: String(initialData.costCenterId ?? ""),
        maintenanceCost: initialData.maintenanceCost ?? 0,
        churchId: user?.churchId ?? 0,
      };
    }

    return {
      description: "",
      maintenanceDate: new Date(),
      patrimonyId: "",
      maintenanceCost: 0,
      costCenterId: "",
      churchId: user?.churchId ?? 0,
    };
  });

  const [patrimonyOptions, setPatrimonyOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [costCenterOptions, setCostCenterOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Carrega patrimônios
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
            patrimonyId: String(initialData.patrimonyId),
          }));
        }
      })
      .catch((err) => console.error("Erro ao carregar patrimônios", err));
  }, [initialData]);

  // Carrega centros de custo
  useEffect(() => {
    apiClient
      .get<CostCenter[]>("/CostCenter")
      .then((res) => {
        const options = res.data.map((cc) => ({
          value: String(cc.id),
          label: cc.name,
        }));
        setCostCenterOptions(options);

        if (initialData?.costCenterId) {
          setFormData((prev) => ({
            ...prev,
            costCenterId: String(initialData.costCenterId),
          }));
        }
      })
      .catch((err) => console.error("Erro ao carregar centros de custo", err));
  }, [initialData]);

  // Atualiza churchId com base no usuário autenticado
  useEffect(() => {
    if (user?.churchId) {
      setFormData((prev) => ({
        ...prev,
        churchId: user.churchId,
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patrimonyId) {
      alert("Selecione um patrimônio.");
      return;
    }

    if (!formData.costCenterId) {
      alert("Selecione um centro de custo.");
      return;
    }

    await onSubmit({
      ...formData,
      patrimonyId: Number(formData.patrimonyId),
      costCenterId: Number(formData.costCenterId),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patrimônio */}
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

      {/* Descrição */}
      <div>
        <Label>Descrição</Label>
        <Input
          type="text"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Data da manutenção */}
      <div>
        <Label>Data de Manutenção</Label>
        <Input
          type="date"
          value={
            formData.maintenanceDate
              ? new Date(formData.maintenanceDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            setFormData({
              ...formData,
              maintenanceDate: new Date(e.target.value),
            })
          }
        />
      </div>

      {/* Valor da manutenção */}
      <div>
        <Label>Valor da Manutenção</Label>
        <Input
          type="number"
          step="0.01"
          value={formData.maintenanceCost}
          onChange={(e) =>
            setFormData({
              ...formData,
              maintenanceCost: parseFloat(e.target.value || "0"),
            })
          }
        />
      </div>

      {/* Centro de custo */}
      <div>
        <Label>Centro de Custo</Label>
        <Select
          options={costCenterOptions}
          placeholder="Selecione um centro de custo"
          value={formData.costCenterId}
          onChange={(val: any) => {
            const newVal =
              typeof val === "string" ? val : (val?.value ?? "");
            setFormData((prev) => ({ ...prev, costCenterId: newVal }));
          }}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
