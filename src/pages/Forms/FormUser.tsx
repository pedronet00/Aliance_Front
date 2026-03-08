import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import apiClient from "@/api/apiClient";
import useGoBack from "@/hooks/useGoBack";
import { UserDTO } from "@/types/Usuario/UserDTO";
import { getImageUrl } from "@/utils/imageUtils";

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
    gender: true,
    churchId: user?.churchId ?? 0,
  }));

  function generateRandomPassword(length: number = 12): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>/?";

    const all = upper + lower + numbers + symbols;
    let password = "";

    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

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
        admissionDate: initialData.admissionDate ? String(initialData.admissionDate).split("T")[0] : undefined,
        baptismDate: initialData.baptismDate ? String(initialData.baptismDate).split("T")[0] : undefined,
        professionOfFaithDate: initialData.professionOfFaithDate ? String(initialData.professionOfFaithDate).split("T")[0] : undefined,
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

    const payload = { ...formData };
    // Remover formatação antes de enviar
    if (payload.cpf) payload.cpf = payload.cpf.replace(/\D/g, "");
    if (payload.phoneNumber) payload.phoneNumber = payload.phoneNumber.replace(/\D/g, "");
    if (payload.cep) payload.cep = payload.cep.replace(/\D/g, "");

    await onSubmit(payload);
    setLoading(false);
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{3})\d+?$/, "$1");
  };

  const professionOptions = [
    "Administrador",
    "Advogado",
    "Arquiteto",
    "Autônomo",
    "Bancário",
    "Comerciante",
    "Contador",
    "Designer",
    "Desenvolvedor/TI",
    "Do Lar",
    "Empresário",
    "Engenheiro",
    "Estudante",
    "Estagiário",
    "Farmacêutico",
    "Fisioterapeuta",
    "Funcionário Público",
    "Médico",
    "Motorista",
    "Odontologista",
    "Professor",
    "Psicólogo",
    "Vendedor",
    "Aposentado",
  ];

  const educationOptions = [
    { value: "Ensino Fundamental Incompleto", label: "Ensino Fundamental Incompleto" },
    { value: "Ensino Fundamental Completo", label: "Ensino Fundamental Completo" },
    { value: "Ensino Médio Incompleto", label: "Ensino Médio Incompleto" },
    { value: "Ensino Médio Completo", label: "Ensino Médio Completo" },
    { value: "Ensino Superior Incompleto", label: "Ensino Superior Incompleto" },
    { value: "Ensino Superior Completo", label: "Ensino Superior Completo" },
    { value: "Pós-graduação", label: "Pós-graduação" },
    { value: "Mestrado", label: "Mestrado" },
    { value: "Doutorado", label: "Doutorado" },
    { value: "Pós-doutorado", label: "Pós-doutorado" },
    { value: "Livre Docente", label: "Livre Docente" },
  ];

  const admissionTypeOptions = [
    { value: "1", label: "Profissão de Fé" },
    { value: "2", label: "Batismo" },
    { value: "3", label: "Batismo e Profissão de Fé" },
    { value: "4", label: "Transferência" },
    { value: "5", label: "Designação" },
    { value: "6", label: "Restauração" },
    { value: "7", label: "Jurisdição" },
  ];

  const genderOptions = [
    { value: "true", label: "Masculino" },
    { value: "false", label: "Feminino" },
  ];

  const maritalStatusOptions = [
    { value: "Solteiro(a)", label: "Solteiro(a)" },
    { value: "Casado(a)", label: "Casado(a)" },
    { value: "Divorciado(a)", label: "Divorciado(a)" },
    { value: "Viúvo(a)", label: "Viúvo(a)" },
  ];

  const statusOptions = [
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">

      {/* Dados Pessoais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 border-b pb-2 dark:border-gray-700">
          Dados Pessoais
        </h3>

        <div className="mb-4">
          <Label>Foto de Perfil</Label>
          <div className="flex items-center gap-4">
            {formData.imageUrl && !formData.image && (
              <img src={getImageUrl(formData.imageUrl)} alt="Perfil" className="w-16 h-16 rounded-full object-cover border" />
            )}
            {formData.image && (
              <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
            )}
            <input
              type="file"
              accept="image/*"
              capture="user"
              className={`focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden focus:file:ring-brand-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:text-white/90 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 dark:placeholder:text-gray-400`}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFormData({ ...formData, image: e.target.files[0] });
                }
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Tire uma foto ou envie um arquivo para o perfil.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label>Nome Completo *</Label>
            <Input
              type="text"
              required
              value={formData.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <Label>CPF</Label>
            <Input
              type="text"
              maxLength={14}
              value={formData.cpf ? maskCPF(formData.cpf) : ""}
              onChange={(e) => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
            />
          </div>
          <div>
            <Label>RG</Label>
            <Input
              type="text"
              value={formData.rg || ""}
              onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
            />
          </div>
          <div>
            <Label>Gênero *</Label>
            <Select
              options={genderOptions}
              value={formData.gender !== undefined ? String(formData.gender) : "true"}
              onChange={(val) => setFormData({ ...formData, gender: val === "true" })}
            />
          </div>
          <div>
            <Label>Estado Civil</Label>
            <Select
              options={maritalStatusOptions}
              placeholder="Selecione"
              value={formData.maritalStatus || ""}
              onChange={(val) => setFormData({ ...formData, maritalStatus: val })}
            />
          </div>
          <div>
            <Label>Profissão</Label>
            <Input
              type="text"
              list="profession-options"
              value={formData.profession || ""}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            />
            <datalist id="profession-options">
              {professionOptions.map((prof) => (
                <option key={prof} value={prof} />
              ))}
            </datalist>
          </div>
          <div>
            <Label>Escolaridade</Label>
            <Select
              options={educationOptions}
              placeholder="Selecione"
              value={formData.education || ""}
              onChange={(val) => setFormData({ ...formData, education: val })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Nome do Pai</Label>
            <Input
              type="text"
              value={formData.fathersName || ""}
              onChange={(e) => setFormData({ ...formData, fathersName: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Nome da Mãe</Label>
            <Input
              type="text"
              value={formData.mothersName || ""}
              onChange={(e) => setFormData({ ...formData, mothersName: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Contato e Endereço */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 border-b pb-2 dark:border-gray-700">
          Contato e Endereço
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label>Email *</Label>
            <Input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Telefone *</Label>
            <Input
              type="text"
              required
              maxLength={15}
              value={formData.phoneNumber ? maskPhone(formData.phoneNumber) : ""}
              onChange={(e) => setFormData({ ...formData, phoneNumber: maskPhone(e.target.value) })}
            />
          </div>
          <div>
            <Label>CEP</Label>
            <Input
              type="text"
              maxLength={9}
              value={formData.cep ? maskCEP(formData.cep) : ""}
              onChange={(e) => setFormData({ ...formData, cep: maskCEP(e.target.value) })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Rua/Endereço</Label>
            <Input
              type="text"
              value={formData.streetAdress || ""}
              onChange={(e) => setFormData({ ...formData, streetAdress: e.target.value })}
            />
          </div>
          <div>
            <Label>Número</Label>
            <Input
              type="number"
              value={formData.streetNumber || ""}
              onChange={(e) => setFormData({ ...formData, streetNumber: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div>
            <Label>Complemento</Label>
            <Input
              type="text"
              value={formData.streetComplement || ""}
              onChange={(e) => setFormData({ ...formData, streetComplement: e.target.value })}
            />
          </div>
          <div>
            <Label>Bairro</Label>
            <Input
              type="text"
              value={formData.streetNeighborhood || ""}
              onChange={(e) => setFormData({ ...formData, streetNeighborhood: e.target.value })}
            />
          </div>
          <div>
            <Label>Cidade</Label>
            <Input
              type="text"
              value={formData.currentCity || ""}
              onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
            />
          </div>
          <div>
            <Label>Estado (UF)</Label>
            <Input
              type="text"
              maxLength={2}
              value={formData.state || ""}
              onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
            />
          </div>
        </div>
      </div>

      {/* Informações Eclesiásticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 border-b pb-2 dark:border-gray-700">
          Informações Eclesiásticas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Religião Anterior</Label>
            <Input
              type="text"
              value={formData.previousReligion || ""}
              onChange={(e) => setFormData({ ...formData, previousReligion: e.target.value })}
            />
          </div>
          <div className="hidden lg:block"></div>
          <div className="hidden lg:block"></div>

          <div>
            <Label>Data do Batismo</Label>
            <Input
              type="date"
              value={formData.baptismDate ? String(formData.baptismDate) : ""}
              onChange={(e) => setFormData({ ...formData, baptismDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Igreja do Batismo</Label>
            <Input
              type="text"
              value={formData.baptismChurch || ""}
              onChange={(e) => setFormData({ ...formData, baptismChurch: e.target.value })}
            />
          </div>
          <div>
            <Label>Pastor do Batismo</Label>
            <Input
              type="text"
              value={formData.baptismPastor || ""}
              onChange={(e) => setFormData({ ...formData, baptismPastor: e.target.value })}
            />
          </div>

          <div>
            <Label>Data de Prof. de Fé</Label>
            <Input
              type="date"
              value={formData.professionOfFaithDate ? String(formData.professionOfFaithDate) : ""}
              onChange={(e) => setFormData({ ...formData, professionOfFaithDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Igreja da Prof. de Fé</Label>
            <Input
              type="text"
              value={formData.professionOfFaithChurch || ""}
              onChange={(e) => setFormData({ ...formData, professionOfFaithChurch: e.target.value })}
            />
          </div>
          <div>
            <Label>Pastor da Prof. de Fé</Label>
            <Input
              type="text"
              value={formData.professionOfFaithPastor || ""}
              onChange={(e) => setFormData({ ...formData, professionOfFaithPastor: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Vínculo e Perfil */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90 border-b pb-2 dark:border-gray-700">
          Vínculo e Perfil
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Data de Admissão</Label>
            <Input
              type="date"
              value={formData.admissionDate ? String(formData.admissionDate) : ""}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Tipo de Admissão</Label>
            <Select
              options={admissionTypeOptions}
              placeholder="Selecione"
              value={formData.admissionType ? String(formData.admissionType) : ""}
              onChange={(val) => setFormData({ ...formData, admissionType: val ? Number(val) : undefined })}
            />
          </div>
          <div>
            <Label>Perfil de Acesso *</Label>
            <Select
              options={roleOptions}
              placeholder="Selecione uma role"
              value={formData.role || ""}
              onChange={(val) => setFormData({ ...formData, role: val })}
            />
          </div>
          <div>
            <Label>Status do Usuário *</Label>
            <Select
              options={statusOptions}
              value={formData.status !== undefined ? String(formData.status) : "true"}
              onChange={(val) => setFormData({ ...formData, status: val === "true" })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => goBack()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
