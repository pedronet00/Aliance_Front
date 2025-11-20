import { useEffect, useState, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { showErrorLogininToast, showSuccessfulLogininToast, showSuccessToast } from "@/components/toast/Toasts";
import apiClient from "@/api/apiClient";

export default function DefinePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

//   useEffect(() => {
//     if (!email || !token) {
//       showErrorLogininToast();
//       navigate("/login");
//     }
//   }, [email, token, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
    //   showErrorLogininToast();
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/User/DefinePassword", {
        email,
        token,
        newPassword: password,
      });

      showSuccessToast("Sua senha foi definida com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
    //   showErrorLogininToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* left */}
          <div className="space-y-6">
            <img src="/images/logo/PNG PRETO.png" alt="Logo" className="w-40" />


            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            Organize, gerencie e cuide da sua igreja.
            </h1>


            <p className="text-gray-600 text-lg">
            Uma plataforma completa para administração de membros, finanças, campanhas
            missionárias, células e muito mais.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-8 border">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Defina sua senha
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Escolha uma senha segura para acessar sua conta.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Nova senha */}
              <div>
                <Label>
                  Nova senha <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Confirmar senha */}
              <div>
                <Label>
                  Confirmar senha <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div>
                <Button disabled={loading} className="w-full" size="sm">
                  {loading ? "Salvando..." : "Definir senha"}
                </Button>
              </div>
            </div>
          </form>
          </div>
      </div>
    </div>
    {/* === Rodapé fixado no fim === */}
        <footer className="text-center py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          © 2025 <span className="font-semibold">Aliance ERP</span> — Todos os
          direitos reservados. CNPJ: 59.742.573/0001-33
        </footer>
    </>
  );
}
