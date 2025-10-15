import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Aliance | ERP para igrejas"
        description="Essa é a página de login do sistema Aliance ERP para igrejas."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
