import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import apiClient from "@/api/apiClient";
import { showErrorToast } from "../toast/Toasts";

// =======================
// DTO COMPLETO
// =======================

interface NewClientDTO {
  churchName: string;
  churchEmail: string;
  churchPhone: string;
  churchPostalCode: string;
  churchCNPJ: string;

  churchAddress: string;
  churchAddressNumber: string;
  churchCity: string;
  churchState: string;
  churchCountry: string;

  userName: string;
  userEmail: string;
  userPhone: string;

  plan: string;
  paymentMethod: string;
}

// =======================
// UI HELPERS
// =======================

const InputField = ({ label, value, onChange, type = "text" }: any) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      className="h-11 w-full"
    />
  </div>
);

const InputFieldRaw = ({ label, value, onChange, readOnly = false }: any) => (
  <div className="space-y-1">
    <Label>{label}</Label>
    <input
      value={value}
      readOnly={readOnly}
      onChange={onChange}
      className={`h-11 w-full rounded-lg border px-4 text-sm shadow-sm dark:bg-gray-800 dark:text-white 
      ${readOnly ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed" : ""}`}
    />
  </div>
);

// =======================
// MAIN COMPONENT
// =======================

export default function SignUpForm() {
  const [step, setStep] = useState(1);
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<NewClientDTO>({
    churchName: "",
    churchEmail: "",
    churchPhone: "",
    churchPostalCode: "",
    churchCNPJ: "",

    churchAddress: "",
    churchAddressNumber: "",
    churchCity: "",
    churchState: "",
    churchCountry: "Brasil",

    userName: "",
    userEmail: "",
    userPhone: "",

    plan: "",
    paymentMethod: "CREDIT_CARD",
  });

  const handleChange = (field: keyof NewClientDTO, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ========================
  // Masks
  // ========================

  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "").slice(0, 11);

    if (value.length <= 2) return `${value}`;
    if (value.length <= 7)
      return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
    return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(
      3,
      7
    )}-${value.slice(7)}`;
  };

  const handlePhoneChange = (
    field: "churchPhone" | "userPhone",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    handleChange(field, raw);
    e.target.value = formatPhone(e.target.value);
  };

  const formatCNPJ = (value: string) => {
    value = value.replace(/\D/g, "");
    return value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{2}\.\d{3}\.\d{3})(\d)/, "$1/$2")
      .replace(/^(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "").slice(0, 14);
    handleChange("churchCNPJ", raw);
    e.target.value = formatCNPJ(e.target.value);
  };

  const formatCEP = (value: string) => {
    value = value.replace(/\D/g, "").slice(0, 8);
    if (value.length <= 5) return value;
    return `${value.slice(0, 5)}-${value.slice(5)}`;
  };

  const handleCEPChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    handleChange("churchPostalCode", raw);
    e.target.value = formatCEP(e.target.value);

    if (raw.length === 8) {
      setLoadingCEP(true);

      try {
        const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
        const data = await res.json();

        if (data.erro) {
          showErrorToast("CEP não encontrado.");
          return;
        }

        handleChange("churchAddress", data.logradouro);
        handleChange("churchCity", data.localidade);
        handleChange("churchState", data.uf);
        handleChange("churchCountry", "Brasil");
      } catch {
        showErrorToast("Erro ao buscar CEP.");
      } finally {
        setLoadingCEP(false);
      }
    }
  };

  const validateStep = () => {
    if (step === 1) {
      return [
        "churchName",
        "churchEmail",
        "churchPhone",
        "churchPostalCode",
        "churchCNPJ",
        "churchAddressNumber",
      ].every((f) => form[f as keyof NewClientDTO] !== "");
    }
    if (step === 2) {
      return ["userName", "userEmail", "userPhone"].every(
        (f) => form[f as keyof NewClientDTO] !== ""
      );
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep())
      return showErrorToast("Preencha todos os campos obrigatórios.");
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // ========================
  // Submit
  // ========================

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/register/new-client", form);
      const { checkoutUrl } = response.data;
      setLoading(false);
      window.location.href = checkoutUrl;
    } catch (error: any) {
      setLoading(false);
      showErrorToast("Ocorreu um erro. Verifique se todos os dados estão preenchidos corretamente, ou tente novamente mais tarde.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="space-y-6">
          <img src="/images/logo/PNG PRETO.png" alt="Logo" className="w-40" />
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Organize, gerencie e cuide da sua igreja.
          </h1>
          <p className="text-gray-600 text-lg">
            Administração completa de membros, finanças e muito mais.
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b pb-1">
                Informações da Igreja
              </h2>

                <InputField
                  label="Nome da Igreja"
                  value={form.churchName}
                  onChange={(e: any) =>
                    handleChange("churchName", e.target.value)
                  }
                />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputFieldRaw
                  label="Telefone"
                  value={formatPhone(form.churchPhone)}
                  onChange={(e: any) => handlePhoneChange("churchPhone", e)}
                />

                <InputFieldRaw
                  label="CNPJ da Igreja"
                  value={formatCNPJ(form.churchCNPJ)}
                  onChange={handleCNPJChange}
                />
              </div>

                <InputField
                  label="Email"
                  type="email"
                  value={form.churchEmail}
                  onChange={(e: any) =>
                    handleChange("churchEmail", e.target.value)
                  }
                />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CEP */}
              <InputFieldRaw
                label="CEP da igreja"
                value={formatCEP(form.churchPostalCode)}
                onChange={handleCEPChange}
              />
              {/* NUMERO */}
              <InputFieldRaw
                label="Número do endereço"
                value={form.churchAddressNumber}
                onChange={(e: any) =>
                  handleChange("churchAddressNumber", e.target.value)
                }
              />
              </div>
              {/* ENDEREÇO AUTO */}
              {/* <InputFieldRaw
                label="Endereço"
                value={form.churchAddress}
                readOnly
              />

              <div className="grid grid-cols-3 gap-4">
                <InputFieldRaw
                  label="Cidade"
                  value={form.churchCity}
                  readOnly
                />
                <InputFieldRaw
                  label="Estado"
                  value={form.churchState}
                  readOnly
                />
                <InputFieldRaw
                  label="País"
                  value={form.churchCountry}
                  readOnly
                />
              </div> */}

              

              {/* PLANO */}
              <div>
                <Label>Plano</Label>
                <select
                  className="h-11 w-full rounded-lg border px-3 shadow-sm dark:bg-gray-800 dark:text-white"
                  value={form.plan}
                  onChange={(e) => handleChange("plan", e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="Básico">Básico</option>
                  <option value="Essencial">Essencial</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>

              <Button onClick={nextStep} className="w-full h-12 text-base mt-2">
                Próximo
              </Button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b pb-1">
                Informações do Usuário Principal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nome do Usuário"
                  value={form.userName}
                  onChange={(e: any) =>
                    handleChange("userName", e.target.value)
                  }
                />
                <InputField
                  label="Email do Usuário"
                  type="email"
                  value={form.userEmail}
                  onChange={(e: any) =>
                    handleChange("userEmail", e.target.value)
                  }
                />
              </div>

              <InputFieldRaw
                label="Telefone do Usuário"
                value={formatPhone(form.userPhone)}
                onChange={(e: any) => handlePhoneChange("userPhone", e)}
              />

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={prevStep} className="h-11 px-6">
                  Voltar
                </Button>
                <Button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="h-11 px-6 !bg-green-600 hover:bg-green-700"
                >
                  Finalizar Cadastro
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
