import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import useGoBack from "@/hooks/useGoBack";
import { UserDTO } from "@/types/Usuario/UserDTO";

type Props = {
  initialData?: UserDTO;
  onSubmit: (data: UserDTO) => Promise<void>;
};

export default function FormUser({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UserDTO>(() => ({
    fullName: "",
    email: "",
    userName: "",
    password: generateRandomPassword(),
    role: "",
    phoneNumber: "",
    status: true,
    churchId: user?.churchId ?? 0,
  }));

  function generateRandomPassword(length: number = 12): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>/?";

    const all = upper + lower + numbers + symbols;

    let password = "";

    // Garante pelo menos 1 de cada tipo
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Preenche o restante
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Embaralha a senha
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }


  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        churchId: user?.churchId ?? initialData.churchId ?? 0,
      });
    }
  }, [initialData, user?.churchId]);

  // Carregar roles da API
  useEffect(() => {
    apiClient
      .get<string[]>("/Roles")
      .then((res) => {
        const options = res.data.map((r) => ({
          value: r,
          label: r,
        }));
        setRoleOptions(options);
      })
      .catch((err) => console.error("Erro ao carregar roles", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nome de Usuário</Label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
        <Label>Telefone</Label>
        <Input
          type="text"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div>
        <Label>Perfil</Label>
        <Select
          options={roleOptions}
          placeholder="Selecione uma role"
          value={formData.role}
          onChange={(val) => setFormData({ ...formData, role: val })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
