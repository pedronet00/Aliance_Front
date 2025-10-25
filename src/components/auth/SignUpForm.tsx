import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import apiClient from "@/api/apiClient";

interface NewClientDTO {
  churchName: string;
  churchEmail: string;
  churchPhone: string;
  churchAddress: string;
  churchCity: string;
  churchState: string;
  churchCountry: string;
  churchCNPJ: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  plan: string;
  paymentMethod: string;
}

export default function SignUpForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewClientDTO>({
    churchName: "",
    churchEmail: "",
    churchPhone: "",
    churchAddress: "",
    churchCity: "",
    churchState: "",
    churchCountry: "",
    churchCNPJ: "",
    userName: "",
    userEmail: "",
    userPhone: "",
    plan: "",
    paymentMethod: "",
  });

  const handleChange = (field: keyof NewClientDTO, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // === Máscara e formatação de telefone ===
  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "").slice(0, 11);
    if (value.length <= 2) return `(${value}`;
    if (value.length <= 7)
      return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(3)}`;
    if (value.length <= 11)
      return `(${value.slice(0, 2)}) ${value.slice(2, 3)} ${value.slice(
        3,
        7
      )}-${value.slice(7)}`;
    return value;
  };

  const handlePhoneChange = (
    field: "churchPhone" | "userPhone",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    handleChange(field, raw);
    e.target.value = formatPhone(e.target.value);
  };

  // === Máscara de CNPJ ===
  const formatCNPJ = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length <= 2) return value;
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`;
    if (value.length <= 8)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    if (value.length <= 12)
      return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
        5,
        8
      )}/${value.slice(8)}`;
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(
      5,
      8
    )}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, "");
    handleChange("churchCNPJ", raw);
    e.target.value = formatCNPJ(e.target.value);
  };

  const validateStep = () => {
    if (step === 1) {
      const requiredFields = [
        "churchName",
        "churchEmail",
        "churchPhone",
        "churchAddress",
        "churchCity",
        "churchState",
        "churchCountry",
        "churchCNPJ",
      ];
      return requiredFields.every(
        (field) => form[field as keyof NewClientDTO] !== ""
      );
    }

    if (step === 2) {
      const requiredFields = ["userName", "userEmail", "userPhone"];
      return requiredFields.every(
        (field) => form[field as keyof NewClientDTO] !== ""
      );
    }

    if (step === 3) {
      return form.plan !== "" && form.paymentMethod !== "";
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => s + 1);
    else alert("Por favor, preencha todos os campos obrigatórios.");
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      const response = await apiClient.post("/register/new-client", form);
      const data = response.data;
      const asaasCustomerId = data.asaasCustomerId;
      const checkoutUrl = data.checkoutUrl;

      if (!asaasCustomerId || !checkoutUrl) {
        alert("Erro ao obter dados do cliente ou link de checkout.");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors)
        alert(error.response.data.errors[0]);
      else if (error.response?.data?.message)
        alert(error.response.data.message);
      else alert("Erro inesperado ao registrar o cliente.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 border border-gray-200 rounded-lg p-6 shadow-md dark:border-gray-700">
      {/* === Etapa 1 === */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium mb-3">Informações da Igreja</h2>

          {/* Nome */}
          <div>
            <Label>Nome da Igreja</Label>
            <Input
              maxLength={80}
              value={form.churchName}
              onChange={(e) => handleChange("churchName", e.target.value)}
            />
          </div>

          {/* Email, Telefone e CNPJ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Email da Igreja</Label>
              <Input
                type="email"
                maxLength={50}
                value={form.churchEmail}
                onChange={(e) => handleChange("churchEmail", e.target.value)}
              />
            </div>

            <div>
              <Label>Telefone</Label>
              <input
                type="text"
                maxLength={16}
                defaultValue={formatPhone(form.churchPhone)}
                onChange={(e) => handlePhoneChange("churchPhone", e)}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div>
              <Label>CNPJ da Igreja</Label>
              <input
                type="text"
                value={formatCNPJ(form.churchCNPJ)}
                onChange={handleCNPJChange}
                maxLength={18}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <Label>Endereço</Label>
            <Input
              maxLength={100}
              value={form.churchAddress}
              onChange={(e) => handleChange("churchAddress", e.target.value)}
            />
          </div>

          {/* Cidade, Estado, País */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Cidade</Label>
              <Input
                maxLength={50}
                value={form.churchCity}
                onChange={(e) => handleChange("churchCity", e.target.value)}
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Input
                maxLength={50}
                value={form.churchState}
                onChange={(e) => handleChange("churchState", e.target.value)}
              />
            </div>

            <div>
              <Label>País</Label>
              <Input
                maxLength={50}
                value={form.churchCountry}
                onChange={(e) => handleChange("churchCountry", e.target.value)}
              />
            </div>
          </div>

          <Button onClick={nextStep} className="w-full mt-6">
            Próximo
          </Button>
        </div>
      )}

      {/* === Etapa 2 === */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium mb-3">Informações do Usuário</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nome do Usuário</Label>
              <Input
                maxLength={80}
                value={form.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
              />
            </div>

            <div>
              <Label>Email do Usuário</Label>
              <Input
                type="email"
                maxLength={50}
                value={form.userEmail}
                onChange={(e) => handleChange("userEmail", e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Telefone do Usuário</Label>
              <input
                type="text"
                maxLength={16}
                defaultValue={formatPhone(form.userPhone)}
                onChange={(e) => handlePhoneChange("userPhone", e)}
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="secondary" onClick={prevStep}>
              Voltar
            </Button>
            <Button onClick={nextStep}>Próximo</Button>
          </div>
        </div>
      )}

      {/* === Etapa 3 === */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium mb-3">Plano e Pagamento</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Plano</Label>
              <select
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                value={form.plan}
                onChange={(e) => handleChange("plan", e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="Essencial">Plano Essencial</option>
                <option value="Premium">Plano Premium</option>
                <option value="Basico">Plano Básico</option>
              </select>
            </div>

            <div>
              <Label>Forma de Pagamento</Label>
              <select
                className="w-full border rounded p-2 bg-white dark:bg-gray-800"
                value={form.paymentMethod}
                onChange={(e) =>
                  handleChange("paymentMethod", e.target.value)
                }
              >
                <option value="">Selecione...</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="BOLETO">Boleto Bancário</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="secondary" onClick={prevStep}>
              Voltar
            </Button>
            <Button onClick={handleSubmit}>Finalizar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
