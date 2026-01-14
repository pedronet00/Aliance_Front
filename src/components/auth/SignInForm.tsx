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
    } catch (err) {
      setLoading(false);
      showErrorToast(err?.response?.data?.message.toString() || "Erro ao fazer login. Tente novamente.");
    }
  };

  return (
  <div className="w-full">
    <div className="mb-5">
        <div>
          <div className="mb-5 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center justify-center sm:justify-start">
              <img src="/images/logo/PNG PRETO.png" alt="Logo" width={80} />
            </Link>

            {/* Textos */}
            <div>
              <h1 className="mt-3 sm:mt-0 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Faça o login
              </h1>

              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                Insira o seu email e senha para acessar sua conta.
              </p>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="Informe seu email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    // required
                  />
                </div>
                <div>
                  <Label>
                    Senha <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Informe sua senha"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      // required
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
                <div className="flex items-center justify-between">
                  <Link
                    to="/esqueceu-a-senha"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
                <div>
                  <Button disabled={loading} className="w-full h-12 text-base mt-2" size="sm">
                    Entrar
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Não tem uma conta?{" "}
                <Link
                  to="/registrar"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Registre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
