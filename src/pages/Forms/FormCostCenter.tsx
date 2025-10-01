import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CostCenter } from "@/types/CostCenter/CostCenter";
import { CostCenterDTO } from "@/types/CostCenter/CostCenterDTO";
import { Department } from "@/types/Department/Department";

type Props = {
  initialData?: CostCenterDTO;
  onSubmit: (data: CostCenterDTO) => Promise<void>;
};

export default function FormCostCenter({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<CostCenterDTO>(() => {
  if (initialData) {
    return {
      ...initialData,
      departmentId: String(initialData.departmentId ?? ""),
      churchId: user?.churchId ?? 0,
    };
  }

  return {
    name: "",
    departmentId: "",
    churchId: user?.churchId ?? 0,
  };
});

  const [departmentOptions, setDepartmentOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Carrega os centros de custo e ajusta o formData se estiver editando
  useEffect(() => {
  apiClient
    .get<Department[]>("/Department")
    .then((res) => {
      const options = res.data.map((f) => ({
        value: String(f.id),
        label: f.name,
      }));
      setDepartmentOptions(options);

      if (initialData?.departmentId) {
        setFormData((prev) => ({
          ...prev,
          departmentId: String(initialData.departmentId), // garante string
        }));
      }

    })
    .catch((err) => console.error("Erro ao carregar departamentos", err));
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
    departmentId: Number(formData.departmentId),
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Departamento</Label>
        <Select
  options={departmentOptions}
  placeholder="Selecione um departamento"
  value={formData.departmentId}
  onChange={(val) =>
    setFormData({ ...formData, departmentId: val })
  }
/>



      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
