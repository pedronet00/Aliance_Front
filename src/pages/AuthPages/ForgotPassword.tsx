import PageMeta from "../../components/common/PageMeta";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Aliance | Redefinição de senha"
        description="Redefinição de senha do sistema Aliance ERP."
      />

      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url("./images/backgrounds/fundo.jpg")`,
          backgroundSize: "cover",
        }}
      >
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
          <ResetPasswordForm />
        </div>
      </div>
    </>
  );
}
