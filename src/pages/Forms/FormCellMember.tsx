import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { useParams } from "react-router-dom";
import { CellMemberDTO } from "@/types/Cell/CellMemberDTO";

export type CellMemberFormData = CellMemberDTO;

type Props = {
  onSubmit: (data: CellMemberFormData) => Promise<void>;
};

export default function FormCellMember({ onSubmit }: Props) {
  const { cellGuid } = useParams(); // obtém o guid da célula pela URL
  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<CellMemberFormData>({
    memberGuid: "",
    cellGuid: cellGuid ?? "",
  });

  // 🔹 Carrega lista de usuários disponíveis
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
    if (!formData.cellGuid || !formData.memberGuid) return;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Membro</Label>
        <Select
          options={members}
          placeholder="Selecione o membro"
          value={formData.memberGuid}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, memberGuid: value });
          }}
        />
      </div>

      <Button type="submit">Adicionar Membro</Button>
    </form>
  );
}
