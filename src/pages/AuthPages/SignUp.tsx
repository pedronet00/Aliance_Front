import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Registre-se | Aliance ERP para igrejas"
        description="Essa é a página de registro do Aliance."
      />

      <div className="flex flex-col" style={{ backgroundImage: `url("./images/backgrounds/fundo.jpg")`, backgroundSize: "cover" }} >
        {/* === Conteúdo principal centralizado === */}
        <div className="flex flex-col justify-center items-center flex-grow p-4 md:max-h-[100vh]">
          <div className="w-full max-w-7xl">
            <SignUpForm />
          </div>
        </div>
      </div>
    </>
  );
}
