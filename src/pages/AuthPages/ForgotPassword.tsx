import PageMeta from "../../components/common/PageMeta";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";
import AuthLayout from "./AuthPageLayout";

export default function ForgotPassword() {
  return (
    <>
      <PageMeta
        title="Aliance | Redefinição de senha"
        description="Redefinição de senha do sistema Aliance ERP."
      />

      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
}
