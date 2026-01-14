import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { DepartmentDTO } from "@/types/Department/DepartmentDTO";
import useGoBack from "@/hooks/useGoBack";

type Props = {
  initialData?: DepartmentDTO;
  onSubmit: (data: DepartmentDTO) => Promise<void>;
};

export default function FormDepartment({ initialData, onSubmit }: Props) {

    const {user} = useAuth();
    const goBack = useGoBack();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<DepartmentDTO>({
      ...initialData,
      name: initialData?.name ?? "",
      status: initialData?.status ?? true,
      churchId: initialData?.churchId ?? user?.churchId ?? 0,
      branchId: initialData?.branchId ?? user?.branchId
    });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome do departamento</Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
