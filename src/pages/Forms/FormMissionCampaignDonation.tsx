import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";
import { MissionCampaignDonationDTO} from "@/types/MissionCampaignDonation/MissionCampaignDonationDTO";
import useGoBack from "@/hooks/useGoBack";
import { useParams } from "react-router";


type Props = {
  onSubmit: (data: MissionCampaignDonationDTO) => Promise<void>;
};

export default function FormMissionCampaignDonation({ onSubmit }: Props) {
  const { user } = useAuth();
  const {campaignGuid} = useParams<{campaignGuid: string}>();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<MissionCampaignDonationDTO>({
    userId: "",
    campaignGuid: campaignGuid,
    amount: 0,
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/User/paged?pageNumber=1&pageSize=1000");
        const list = res.data.result.items.map((u: any) => ({
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
    setLoading(true);
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

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>Cancelar</Button>
          <Button type="submit" disabled={loading}>Salvar</Button>
        </div>
      </div>
    </form>
  );
}
