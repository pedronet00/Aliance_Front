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
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: PatrimonyMaintenanceDTO;
  onSubmit: (data: PatrimonyMaintenanceDTO) => Promise<void>;
};

export default function FormPatrimonyMaintenance({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

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
      .get<Patrimony[]>("/Patrimony/paged?pageNumber=1&pageSize=1000")
      .then((res) => {
        const options = res.data.items.map((f) => ({
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
      .get<CostCenter[]>("/CostCenter/active")
      .then((res) => {
        const options = res.data.result.map((cc) => ({
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

    setLoading(true);

    await onSubmit({
      ...formData,
      patrimonyId: Number(formData.patrimonyId),
      costCenterId: Number(formData.costCenterId),
    });
    setLoading(false);
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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
