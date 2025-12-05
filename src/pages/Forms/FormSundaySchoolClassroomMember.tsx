import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { useParams } from "react-router-dom";
import { SundaySchoolClassroomMemberDTO } from "@/types/SundaySchoolClassroomMember/SundaySchoolClassroomMemberDTO";
import useGoBack from "@/hooks/useGoBack";

export type MemberFormData = SundaySchoolClassroomMemberDTO;

type Props = {
  onSubmit: (data: MemberFormData) => Promise<void>;
};

export default function FormSundaySchoolClassroomMember({ onSubmit }: Props) {
  const { classroomGuid } = useParams();
  const goBack = useGoBack();

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<MemberFormData>({
    memberGuid: "",
    classroomGuid: classroomGuid ?? "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/User/active");
        const list = res.data.result.map((u: any) => ({
          value: u.id,
          label: u.fullName,
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
    setLoading(true);
    if (!formData.classroomGuid || !formData.memberGuid) return;

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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
