import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { showSuccessfulLogininToast, showErrorToast } from "../toast/Toasts";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showSuccessfulLogininToast();
      navigate("/");
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showErrorToast(err?.response?.data?.message?.toString() || "Erro ao fazer login. Tente novamente.");
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-10">
        <div>
          <div className="flex justify-center mb-8">
            <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
              <img src="/images/logo/PNG PRETO.png" alt="Logo" width={120} className="dark:hidden" />
              <img src="/images/logo/PNG BRANCO.png" alt="Logo" width={120} className="hidden dark:block" />
            </Link>
          </div>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Seja bem-vindo <span className="text-blue-600 dark:text-blue-500">de volta!</span>
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Continue sua jornada de gestão com a Aliance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ml-1">
                  Seu e-mail
                </Label>
                <Input
                  placeholder="nome@igreja.com.br"
                  type="email"
                  className="h-14 px-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#0e357a]/5 transition-all outline-none"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Sua senha
                  </Label>
                  <Link
                    to="/esqueceu-a-senha"
                    className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-14 px-6 rounded-2xl bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#0e357a]/5 transition-all outline-none"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-5 top-1/2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {showPassword ? (
                      <EyeIcon className="text-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="text-gray-400 size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                disabled={loading}
                className="w-full h-15 text-lg font-bold rounded-[1.25rem] bg-[#0e357a] hover:bg-[#0b2b63] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#0e357a]/20"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Autenticando...</span>
                  </div>
                ) : (
                  "Entrar no Sistema"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800">
            <p className="text-sm font-medium text-center text-gray-500 dark:text-gray-400">
              Ainda não faz parte da Aliance?{" "}
              <Link
                to="/registrar"
                className="text-[#0e357a] font-bold hover:underline decoration-2 underline-offset-4"
              >
                Criar conta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
