import { useEffect, useState, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { showErrorLogininToast, showSuccessfulLogininToast } from "@/components/toast/Toasts";
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
      await apiClient.post("/User/DefineFirstPassword", {
        email,
        token,
        newPassword: password,
      });

      console.log("chegou aqui");

    //   showSuccessfulLogininToast();
    //   navigate("/login");
    } catch (error) {
      console.error(error);
    //   showErrorLogininToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
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
  );
}
