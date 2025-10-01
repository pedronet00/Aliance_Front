import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ClienteDTO } from "@/types/Cliente/ClienteDTO";

type Props = {
  initialData?: ClienteDTO;
  onSubmit: (data: ClienteDTO) => Promise<void>;
};

export default function FormCliente({ initialData, onSubmit }: Props) {

    const {user} = useAuth();

    const [formData, setFormData] = useState<ClienteDTO>(
        initialData ?? {
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        endereco: "",
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
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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

      <div>
        <Label>Telefone</Label>
        <Input
          type="text"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <Label>Endereço</Label>
        <Input
          type="text"
          value={formData.endereco}
          onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
