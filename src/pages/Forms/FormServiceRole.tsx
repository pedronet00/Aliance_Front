import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";
import useGoBack from "@/hooks/useGoBack";

type ServiceRoleDTO = {
  serviceGuid: string;
  memberId: string;
  role: string;
};

export default function FormServiceRole() {
  const { serviceGuid } = useParams();
  const { user } = useAuth();
  const goBack = useGoBack();

  const [members, setMembers] = useState<{ value: string; label: string }[]>([]);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [formData, setFormData] = useState<ServiceRoleDTO>({
    serviceGuid: serviceGuid ?? "",
    memberId: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await apiClient.get("/User/paged?pageNumber=1&pageSize=1000");
        const list = res.data.result.items.map((u: any) => ({
          value: u.id,
          label: u.userName,
        }));
        setMembers(list);

        // Gera lista de cargos (ServiceRoles)
        const serviceRoles = [
          "Pregador",
          "Dirigente",
          "Regente",
          "Pianista",
          "Guitarrista",
          "Baterista",
          "Vocalista1",
          "Vocalista2",
          "Vocalista3",
          "Vocalista4",
          "Midia1",
          "Midia2",
          "Midia3",
          "Midia4",
          "Midia5",
          "Recepcao1",
          "Recepcao2",
          "Recepcao3",
          "Organista",
          "Sonoplasta1",
          "Sonoplasta2",
          "Estacionamento1",
          "Estacionamento2",
          "Bercario1",
          "Bercario2",
          "Baixista",
          "Tecladista",
          "Violonista",
          "Violista",
          "BackVocal1",
          "BackVocal2",
          "Cinegrafista1",
          "Cinegrafista2",
          "TransmissaoOnline",
          "Iluminacao",
          "Fotografo",
          "EditorMidia",
          "Intercessao1",
          "Intercessao2",
          "Diacono1",
          "Diacono2",
          "Diacono3",
          "Diacono4",
          "AberturaEBD",
          "ProfessorInfantil1",
          "ProfessorInfantil2",
          "AssistenteInfantil1",
        ];

        setRoles(serviceRoles.map((r) => ({ value: r, label: r })));
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    };

    fetchMembers();
  }, [user?.churchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId || !formData.role) {
      alert("Selecione o membro e o cargo antes de salvar.");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post("/ServiceRole", {
        serviceGuid: formData.serviceGuid,
        memberId: formData.memberId,
        role: formData.role,
      });

      alert("Cargo adicionado com sucesso!");
      setFormData((prev) => ({ ...prev, memberId: "", role: "" }));
    } catch (err) {
      console.error("Erro ao salvar cargo:", err);
      alert("Erro ao salvar cargo. Verifique o console.");
    } finally {
      setLoading(false);
    }
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
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, memberId: value });
          }}
        />
      </div>

      {/* Cargo */}
      <div>
        <Label>Cargo</Label>
        <Select
          options={roles}
          placeholder="Selecione o cargo"
          value={formData.role}
          onChange={(val: any) => {
            const value = typeof val === "object" ? val.value : val;
            setFormData({ ...formData, role: value });
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
