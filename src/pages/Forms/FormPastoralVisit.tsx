import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { PastoralVisitDTO } from "@/types/PastoralVisit/PastoralVisitDTO";

type Props = {
  initialData?: PastoralVisitDTO;
  onSubmit: (data: PastoralVisitDTO) => Promise<void>;
};

export default function FormPastoralVisit({ initialData, onSubmit }: Props) {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PastoralVisitDTO>(() => {
    if (initialData) {
      return {
        ...initialData,
        visitDate: new Date(initialData.visitDate), // garante Date
        churchId: user?.churchId ?? 0,
      };
    }

    return {
      visitDate: new Date(),
      description: "",
      visitedMemberId: "",
      pastorId: "",
      status: "Agendado",
      churchId: user?.churchId ?? 0,
    };
  });

  const [pastoresOptions, setPastoresOptions] = useState<{ value: string; label: string }[]>([]);
  const [membrosOptions, setMembrosOptions] = useState<{ value: string; label: string }[]>([]);

  // Carrega pastores
  useEffect(() => {
    apiClient
      .get("/User/pastores")
      .then((res) => {
        const options = res.data.result.map((p: any) => ({
          value: p.id,
          label: p.userName,
        }));
        setPastoresOptions(options);

        if (initialData?.pastorId) {
          setFormData((prev) => ({ ...prev, pastorId: initialData.pastorId }));
        }
      })
      .catch((err) => console.error("Erro ao carregar pastores", err));
  }, [initialData]);

  // Carrega membros
  useEffect(() => {
    apiClient
      .get("/User")
      .then((res) => {
        const options = res.data.result.map((m: any) => ({
          value: m.id,
          label: m.userName,
        }));
        setMembrosOptions(options);

        if (initialData?.visitedMemberId) {
          setFormData((prev) => ({ ...prev, visitedMemberId: initialData.visitedMemberId }));
        }
      })
      .catch((err) => console.error("Erro ao carregar membros", err));
  }, [initialData]);

  // Atualiza churchId quando user mudar
  useEffect(() => {
    if (user?.churchId) {
      setFormData((prev) => ({ ...prev, churchId: user.churchId }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normaliza para string ISO sem timezone
    const payload: PastoralVisitDTO = {
      ...formData,
      visitDate: formatDateTimeLocal(new Date(formData.visitDate))
    };

    await onSubmit(payload);
  };

  function formatDateTimeLocal(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
  <Label>Data da Visita</Label>
  <Input
    type="datetime-local"
    value={formData.visitDate ? formatDateTimeLocal(new Date(formData.visitDate)) : ""}
    onChange={(e) =>
      setFormData({ ...formData, visitDate: new Date(e.target.value) })
    }
  />
</div>


      <div>
        <Label>Descrição</Label>
        <TextArea
          rows={4}
          placeholder="Escreva um breve resumo de como foi a visita, ou o que espera tratar quando ela ocorrer."
          value={formData.description}
          onChange={(val) => setFormData({ ...formData, description: val })}
        />
      </div>

      <div>
        <Label>Pastor Responsável</Label>
        <Select
          options={pastoresOptions}
          placeholder="Selecione um pastor"
          value={formData.pastorId}
          onChange={(val) => setFormData({ ...formData, pastorId: val })}
        />
      </div>

      <div>
        <Label>Membro Visitado</Label>
        <Select
          options={membrosOptions}
          placeholder="Selecione um membro"
          value={formData.visitedMemberId}
          onChange={(val) => setFormData({ ...formData, visitedMemberId: val })}
        />
      </div>

      <div>
        <Label>Status</Label>
        <Select
          options={[
            { value: "Agendado", label: "Agendado" },
            { value: "Completado", label: "Completado" },
            { value: "Cancelado", label: "Cancelado" },
            { value: "Adiado", label: "Adiado" },
          ]}
          placeholder="Selecione o status"
          value={formData.status}
          onChange={(val) => setFormData({ ...formData, status: val })}
        />
      </div>

      <Button type="submit">Salvar</Button>
    </form>
  );
}
