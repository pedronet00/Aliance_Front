import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ServiceRoleDTO } from "@/types/ServiceRole/ServiceRoleDTO";
import useGoBack from "@/hooks/useGoBack";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router";

type Props = {
  initialData?: ServiceRoleDTO;
  onSubmit: (data: ServiceRoleDTO) => Promise<void>;
};

export default function FormServiceRole({ initialData, onSubmit }: Props) {
  const { user } = useAuth();
  const goBack = useGoBack();
  const [loading, setLoading] = useState(false);
  const {serviceGuid} = useParams();

  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState<ServiceRoleDTO>(
    initialData ?? {
      serviceGuid: serviceGuid,
      memberId: "",
      role: "",
    }
  );

  useEffect(() => {
    const fetchMembersAndRoles = async () => {
      try {
        // membros
        const res = await apiClient.get("/User/paged?pageNumber=1&pageSize=1000");
        const list = res.data.result.items.map((u: any) => ({
          value: u.id,
          label: u.fullName,
        }));
        setMembers(list);

        // cargos
        const serviceRoles = [
          "Pregador", "Dirigente", "Regente", "Pianista", "Guitarrista", "Baterista",
          "Vocalista1", "Vocalista2", "Vocalista3", "Vocalista4",
          "Midia1", "Midia2", "Midia3", "Midia4", "Midia5",
          "Recepcao1", "Recepcao2", "Recepcao3",
          "Organista", "Sonoplasta1", "Sonoplasta2",
          "Estacionamento1", "Estacionamento2",
          "Bercario1", "Bercario2",
          "Baixista", "Tecladista", "Violonista", "Violista",
          "BackVocal1", "BackVocal2",
          "Cinegrafista1", "Cinegrafista2",
          "TransmissaoOnline", "Iluminacao", "Fotografo", "EditorMidia",
          "Intercessao1", "Intercessao2",
          "Diacono1", "Diacono2", "Diacono3", "Diacono4",
          "AberturaEBD",
          "ProfessorInfantil1", "ProfessorInfantil2", "AssistenteInfantil1",
        ];
        setRoles(serviceRoles.map((r) => ({ value: r, label: r })));
      } catch (_) {}
    };

    fetchMembersAndRoles();
  }, [user?.churchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Adicionar Cargo ao Culto</h2>

      {/* Membro */}
      <div>
        <Label>Membro</Label>
        <Select
          options={members}
          placeholder="Selecione o membro"
          value={formData.memberId}
          onChange={(val: any) =>
            setFormData({ ...formData, memberId: typeof val === "object" ? val.value : val })
          }
        />
      </div>

      {/* Cargo */}
      <div>
        <Label>Cargo</Label>
        <Select
          options={roles}
          placeholder="Selecione o cargo"
          value={formData.role}
          onChange={(val: any) =>
            setFormData({ ...formData, role: typeof val === "object" ? val.value : val })
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-4">
          <Button type="button" variant="secondary" onClick={() => goBack()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}
