import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";

type UserDTO = {
  id?: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  status: boolean;
  churchId: number;
};

type Props = {
  initialData?: UserDTO;
  onSubmit: (data: UserDTO) => Promise<void>;
};

export default function FormUser({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<UserDTO>(() => {
    if (initialData) {
      return {
        ...initialData,
        churchId: user?.churchId ?? 0,
      };
    }
    return {
      userName: "",
      email: "",
      password: "",
      role: "",
      phone: "",
      status: true,
      churchId: user?.churchId ?? 0,
    };
  });

  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);

  // Carregar roles da API
  useEffect(() => {
    apiClient
      .get<string[]>("/Roles") // endpoint que deve devolver a lista de roles
      .then((res) => {
        const options = res.data.map((r) => ({
          value: r,
          label: r,
        }));
        setRoleOptions(options);
      })
      .catch((err) => console.error("Erro ao carregar roles", err));
  }, []);

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
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome de Usuário</Label>
        <Input
          type="text"
          value={formData.userName}
          onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
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

      {!initialData && (
        <div>
          <Label>Senha</Label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
      )}

      <div>
        <Label>Telefone</Label>
        <Input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div>
        <Label>Role</Label>
        <Select
          options={roleOptions}
          placeholder="Selecione uma role"
          value={formData.role}
          onChange={(val) => setFormData({ ...formData, role: val })}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          options={[
            { value: "true", label: "Ativo" },
            { value: "false", label: "Inativo" },
          ]}
          value={formData.status.toString()}
          onChange={(val) => setFormData({ ...formData, status: val === "true" })}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
