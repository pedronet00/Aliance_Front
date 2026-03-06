import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Registre-se | Aliance ERP para igrejas"
        description="Essa é a página de registro do Aliance."
      />

      <div
        className="flex flex-col min-h-screen bg-gray-900 overflow-x-hidden relative"
        style={{ background: "radial-gradient(circle at top left, #0e357a 0%, #030406 100%)" }}
      >
        {/* Subtle Decorative Shapes for Register Screen */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] -z-0" />

        <div className="flex flex-col justify-center items-center flex-grow p-4 md:max-h-[100vh] relative z-10">
          <div className="w-full max-w-7xl">
            <SignUpForm />
          </div>
        </div>
      </div>
    </>
  );
}
