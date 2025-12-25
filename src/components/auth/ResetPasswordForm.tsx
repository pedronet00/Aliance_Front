import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { Button } from "../ui/button";
import apiClient from "../../api/apiClient";
import { showErrorToast, showSuccessToast } from "../toast/Toasts";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post(`/User/PasswordDefinitionMail/${email}`);
      showSuccessToast("Email de redefinição enviado com sucesso.");
      setEmail("");
    } catch (err: any) {
      showErrorToast(
        err?.response?.data?.message || "Erro ao enviar email de redefinição."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
        <Link to="/" className="flex-shrink-0">
          <img src="/images/logo/PNG PRETO.png" alt="Logo" width={80} />
        </Link>

        <div>
          <h1 className="mt-3 sm:mt-0 font-semibold text-gray-800 text-title-sm sm:text-title-md">
            Redefinir senha
          </h1>
          <p className="mt-3 text-sm text-gray-500 max-w-xs">
            Informe seu email para receber o link de redefinição de senha.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              placeholder="Informe seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            disabled={loading}
            className="w-full h-12 text-base"
            size="sm"
          >
            Enviar email
          </Button>
        </div>
      </form>

      <div className="mt-5 text-center">
        <Link
          to="/login"
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}
