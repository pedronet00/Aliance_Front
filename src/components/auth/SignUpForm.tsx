import { useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import apiClient from "@/api/apiClient";
import { showErrorToast } from "../toast/Toasts";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

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
  password: string;

  plan: string;
  planValue: number;
  paymentMethod: string;
}

const PLAN_VALUES: Record<string, number> = {
  Básico: 79.9,
  Essencial: 119.9,
  Premium: 199.9,
};

const PLAN_DETAILS: Record<string, { description: string, features: string[] }> = {
  Básico: {
    description: 'Ideal para pequenas congregações.',
    features: [
      'Até 100 membros ativos',
      'Controle financeiro simples',
      'Relatórios básicos de gestão',
      'Suporte via e-mail',
      'Acesso seguro e backups diários'
    ]
  },
  Essencial: {
    description: 'Feito para igrejas em crescimento rápido.',
    features: [
      'Membros ilimitados',
      'Gestão de células e grupos',
      'Painel financeiro avançado',
      'Controle de eventos e calendário',
      'Suporte prioritário (WhatsApp)',
      'Relatórios detalhados exportáveis'
    ]
  },
  Premium: {
    description: 'A solução completa para múltiplas sedes.',
    features: [
      'Gestão avançada de filiais',
      'Dashboard 100% personalizado',
      'Controle rigoroso de patrimônio',
      'Treinamento de equipe e onboarding',
      'API nativa para integrações',
      'Gerente de conta dedicado 24/7'
    ]
  }
};


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
  const { login } = useAuth();

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
    password: "",
    planValue: 0,
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

    if (step === 2) {
      return [
        "churchCNPJ",
        "churchPostalCode",
        "churchAddressNumber",
      ].every((f) => form[f as keyof NewClientDTO] !== "");
    }

    if (step === 3) {
      return ["userName", "userEmail", "userPhone", "password"].every(
        (f) => form[f as keyof NewClientDTO] !== ""
      );
    }

    return true;
  };

  const validateStep1Async = async () => {
    const requiredFilled = ["churchName", "churchEmail", "churchPhone"].every(
      (f) => form[f as keyof NewClientDTO] !== ""
    );

    if (!requiredFilled) {
      showErrorToast("Preencha todos os campos obrigatórios.");
      return false;
    }

    try {
      const res = await apiClient.get(
        `/Register/${encodeURIComponent(form.churchEmail)}`
      );

      const checkoutUrl = res.data?.checkoutUrl?.[0];

      if (checkoutUrl) {
        const result = await Swal.fire({
          icon: "warning",
          title: "Cadastro já encontrado",
          text:
            "Identificamos um cadastro para este e-mail que ainda não concluiu o pagamento. Deseja continuar para o checkout?",
          showCancelButton: true,
          confirmButtonText: "Ir para pagamento",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          window.location.href = checkoutUrl;
        }

        return false; // interrompe o fluxo em qualquer caso
      }

      return true;
    } catch {
      showErrorToast("Erro ao validar cadastro existente.");
      return false;
    }
  };


  const nextStep = async () => {
    if (step === 1) {
      const ok = await validateStep1Async();
      if (!ok) return;
    } else {
      if (!validateStep()) {
        showErrorToast("Preencha todos os campos obrigatórios.");
        return;
      }
    }

    setStep((s) => s + 1);
  };


  const prevStep = () => setStep((s) => s - 1);

  // ========================
  // Submit
  // ========================

  const handleSubmit = async (selectedPlan: string, selectedValue: number) => {
    setLoading(true);
    try {
      const payload = { ...form, plan: selectedPlan, planValue: selectedValue };
      const response = await apiClient.post("/register/new-client", payload);
      const { checkoutUrl } = response.data;
      setLoading(false);

      if (selectedPlan !== 'Gratuito' && checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        if (selectedPlan === 'Gratuito' && form.password) {
          try {
            await login(form.userEmail, form.password);
            window.location.href = '/';
            return;
          } catch (error) {
            showErrorToast("Cadastro concluído, mas ocorreu um erro no login automático.");
          }
        }

        Swal.fire({
          icon: 'success',
          title: 'Cadastro concluído!',
          text: 'Seu cadastro foi realizado com sucesso. Você já pode fazer login no sistema.',
          confirmButtonText: 'Ir para Login',
          confirmButtonColor: '#16a34a'
        }).then(() => {
          window.location.href = '/login';
        });
      }
    } catch (error: any) {
      setLoading(false);
      showErrorToast("Ocorreu um erro. Verifique se todos os dados estão preenchidos corretamente, ou tente novamente mais tarde.");
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl w-full space-y-12">

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Escolha seu plano
            </h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
              Comece hoje mesmo a transformar a administração da sua igreja.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 relative z-10">
              <div className="relative flex items-center justify-center w-40 h-40 mb-10">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-brand-500 dark:bg-brand-600 rounded-full blur-[50px] opacity-30 animate-pulse" />

                {/* Outer Ring */}
                <div className="absolute w-32 h-32 rounded-full border-[3px] border-gray-200 dark:border-gray-800" />

                {/* Spinning Ring */}
                <div className="absolute w-32 h-32 rounded-full border-[3px] border-brand-500 border-t-transparent border-r-transparent animate-[spin_1.5s_linear_infinite]" />

                {/* Inner Ring */}
                <div className="absolute w-24 h-24 rounded-full border-[3px] border-brand-300 dark:border-brand-700 border-b-transparent border-l-transparent animate-[spin_2s_linear_infinite_reverse]" />

                {/* Center Bubble */}
                <div className="absolute w-16 h-16 bg-white dark:bg-gray-900 shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center z-10 border border-gray-100 dark:border-gray-800">
                  <div className="w-6 h-6 bg-brand-500 rounded-full animate-ping opacity-75" />
                  <div className="w-4 h-4 bg-brand-600 rounded-full absolute" />
                </div>
              </div>

              <div className="text-center space-y-3 z-10">
                <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Preparando seu espaço...
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
                  Estamos construindo seu ambiente e configurando o banco de dados de maneira segura. Isso leva apenas alguns instantes.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch justify-center max-w-5xl mx-auto">
                {Object.entries(PLAN_VALUES).map(([planName, price]) => {
                  const isHighlighted = planName === 'Essencial';
                  const details = PLAN_DETAILS[planName] || { description: '', features: [] };

                  return (
                    <div
                      key={planName}
                      className={`relative flex flex-col rounded-3xl p-8 shadow-xl cursor-pointer transition-all hover:-translate-y-1 bg-white dark:bg-gray-800 ${isHighlighted
                        ? 'border-2 border-brand-500 ring-4 ring-brand-500/10 md:scale-105 z-10 shadow-2xl'
                        : 'border border-gray-200 dark:border-gray-700 z-0'
                        }`}
                      onClick={() => handleSubmit(planName, price)}
                    >
                      {isHighlighted && (
                        <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-full uppercase tracking-wide shadow-md whitespace-nowrap">
                          Mais Escolhido
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{planName}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm h-10">{details.description}</p>
                      </div>

                      <div className="mb-6">
                        <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                          R$ {price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">/mês</span>
                      </div>

                      <ul className="mb-8 flex-1 space-y-4">
                        {details.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <svg className={`shrink-0 w-5 h-5 mt-0.5 ${isHighlighted ? 'text-brand-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 text-left w-full">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isHighlighted ? "default" : "outline"}
                        className={`w-full py-6 text-base font-semibold rounded-xl transition-all mt-auto ${isHighlighted ? 'bg-brand-500 hover:bg-brand-600 shadow-md' : ''}`}
                      >
                        Selecionar {planName}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 flex flex-col items-center gap-6">
                <button
                  onClick={() => handleSubmit('Gratuito', 0)}
                  disabled={loading}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white underline underline-offset-4 transition-colors"
                >
                  Continuar com o plano Gratuito
                </button>
                <button
                  onClick={prevStep}
                  disabled={loading}
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-2 transition-colors"
                >
                  ← Voltar aos Dados do Usuário
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="space-y-6">
          <img src="/images/logo/PNG BRANCO.png" alt="Logo" className="w-40" />
          <h1 className="text-4xl font-bold text-white leading-tight">
            Organize, gerencie e cuide da sua igreja.
          </h1>
          <p className="text-white text-lg">
            Administração completa de membros, finanças e muito mais.
          </p>
          <small className="text-white">
            © 2025 <span className="font-semibold">Aliance ERP</span> — Todos os
            direitos reservados. CNPJ: 59.742.573/0001-33
          </small>
        </div>

        {/* RIGHT */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b pb-1">
                Dados da Igreja
              </h2>

              <InputField
                label="Nome da Igreja"
                value={form.churchName}
                onChange={(e: any) =>
                  handleChange("churchName", e.target.value)
                }
              />

              <InputField
                label="Email da Igreja"
                type="email"
                value={form.churchEmail}
                onChange={(e: any) =>
                  handleChange("churchEmail", e.target.value)
                }
              />

              <InputFieldRaw
                label="Telefone da Igreja"
                value={formatPhone(form.churchPhone)}
                onChange={(e: any) => handlePhoneChange("churchPhone", e)}
              />

              <Button onClick={nextStep} className="w-full h-12">
                Próximo
              </Button>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Já possui uma conta?{" "}
                  <Link
                    to="/login"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Faça o login.
                  </Link>
                </p>
              </div>
            </div>

          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b pb-1">
                Informações legais e endereço
              </h2>

              <InputFieldRaw
                label="CNPJ da Igreja"
                value={formatCNPJ(form.churchCNPJ)}
                onChange={handleCNPJChange}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputFieldRaw
                  label="CEP"
                  value={formatCEP(form.churchPostalCode)}
                  onChange={handleCEPChange}
                />

                <InputFieldRaw
                  label="Número"
                  value={form.churchAddressNumber}
                  onChange={(e: any) =>
                    handleChange("churchAddressNumber", e.target.value)
                  }
                />
              </div>

              <div className="flex justify-between">
                <Button variant="secondary" onClick={prevStep}>
                  Voltar
                </Button>
                <Button onClick={nextStep}>
                  Próximo
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium border-b pb-1">
                Usuário Administrador
              </h2>

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

              <InputFieldRaw
                label="Telefone do Usuário"
                value={formatPhone(form.userPhone)}
                onChange={(e: any) => handlePhoneChange("userPhone", e)}
              />

              <InputField
                label="Senha de Acesso"
                type="password"
                value={form.password || ""}
                onChange={(e: any) =>
                  handleChange("password", e.target.value)
                }
              />

              <div className="flex justify-between">
                <Button variant="secondary" onClick={prevStep}>
                  Voltar
                </Button>
                <Button onClick={nextStep}>
                  Próximo
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
