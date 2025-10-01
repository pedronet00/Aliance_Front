import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { DepartmentDTO } from "@/types/Department/DepartmentDTO";

type Props = {
  initialData?: DepartmentDTO;
  onSubmit: (data: DepartmentDTO) => Promise<void>;
};

export default function FormDepartment({ initialData, onSubmit }: Props) {

    const {user} = useAuth();

    const [formData, setFormData] = useState<DepartmentDTO>(
        initialData ?? {
        name: "",
        status: true,
        churchId: user?.churchId ?? 0
        }
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      <Button type="submit">Salvar</Button>
    </form>
  );
}
