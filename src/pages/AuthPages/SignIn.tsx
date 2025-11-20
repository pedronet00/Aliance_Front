import PageMeta from "../../components/common/PageMeta";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Aliance | ERP para igrejas"
        description="Página de login do sistema Aliance ERP."
      />

      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#dcdcdc" }}>
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200">
          <SignInForm />
        </div>
      </div>
    </>
  );
}
