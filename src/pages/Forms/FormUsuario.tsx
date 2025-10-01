import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { UsuarioDTO } from "@/types/Usuario/UsuarioDTO";

type Props = {
  initialData?: UsuarioDTO;
  onSubmit: (data: UsuarioDTO) => Promise<void>;
};

export default function FormUsuario({ initialData, onSubmit }: Props) {

    const {user} = useAuth();

    const [formData, setFormData] = useState<UsuarioDTO>(
        initialData ?? {
        userName: "",
        cpf: "",
        status: true,
        empresaId: user?.empresaId ?? 0
        }
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input
          type="text"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
        />
      </div>

      <div>
        <Label>CPF</Label>
        <Input
          type="text"
          value={formData.cpf}
          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
