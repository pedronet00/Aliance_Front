import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { CostCenterDTO } from "@/types/CostCenter/CostCenterDTO";
import { Department } from "@/types/Department/Department";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: CostCenterDTO;
  onSubmit: (data: CostCenterDTO) => Promise<void>;
};

export default function FormCostCenter({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CostCenterDTO>(() => {
  if (initialData) {
    return {
      ...initialData,
      departmentId: String(initialData.departmentId ?? ""),
      churchId: user?.churchId ?? 0,
        branchId: user?.branchId
    };
  }

  return {
    name: "",
    departmentId: "",
    churchId: user?.churchId ?? 0,
        branchId: user?.branchId
  };
});

  const [departmentOptions, setDepartmentOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
  apiClient
    .get<Department[]>("/Department/active")
    .then((res) => {
      const options = res.data.result.map((f) => ({
        value: String(f.id),
        label: f.name,
      }));
      setDepartmentOptions(options);

      if (initialData?.departmentId) {
        setFormData((prev) => ({
          ...prev,
          departmentId: String(initialData.departmentId),
        branchId: user?.branchId // garante string
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
    setLoading(true);
    await onSubmit({
      ...formData,
      departmentId: Number(formData.departmentId),
      branchId: user?.branchId
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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
