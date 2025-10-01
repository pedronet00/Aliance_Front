import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { FornecedorDTO } from "@/types/Fornecedor/FornecedorDTO";

type Props = {
  initialData?: FornecedorDTO;
  onSubmit: (data: FornecedorDTO) => Promise<void>;
};

export default function FormFornecedor({ initialData, onSubmit }: Props) {

    const {user} = useAuth();

    const countries = [
    { code: "BR", label: "+55" },
    { code: "US", label: "+1" },
    { code: "AR", label: "+54" },
  ];

    const [formData, setFormData] = useState<FornecedorDTO>(
        initialData ?? {
        nome: "",
        cnpj: "",
        telefone: "",
        email: "",
        endereco: "",
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
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
        />
      </div>

      <div>
        <Label>CNPJ</Label>
        <Input
          type="text"
          value={formData.cnpj}
          onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
        />
      </div>

      <div>
        <Label>Telefone</Label>
        <PhoneInput
          countries={countries}
          placeholder="+55 (18) 99999-9999"
          selectPosition="start"
          onChange={(value) =>
            setFormData({ ...formData, telefone: value })
          }
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
