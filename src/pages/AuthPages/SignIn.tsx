import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Aliance | ERP para igrejas"
        description="Página de login do sistema Aliance ERP."
      />

      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
