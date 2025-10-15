import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";
import { TitheDTO} from "@/types/Tithe/TitheDTO";

type Props = {
  onSubmit: (data: TitheDTO) => Promise<void>;
};

export default function FormTithe({ onSubmit }: Props) {
  const { user } = useAuth();
  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<TitheDTO>({
    userId: "",
    churchId: user?.churchId ?? 0,
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/User");
        const list = res.data.result.map((u: any) => ({
          value: u.id,
          label: u.userName,
        }));
        setMembers(list);
      } catch (err) {
        console.error("Erro ao carregar usuários", err);
      }
    };
    fetchMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.amount) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Membro</Label>
        <Select
          options={members}
          placeholder="Selecione o membro"
          value={formData.userId}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, userId: value });
          }}
        />
      </div>

      <div>
        <Label>Valor</Label>
        <Input
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
        />
      </div>

      <div>
        <Label>Data</Label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <Button type="submit">Registrar Dízimo</Button>
    </form>
  );
}
