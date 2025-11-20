import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Registre-se | Aliance ERP para igrejas"
        description="Essa é a página de registro do Aliance."
      />

      <div className="flex flex-col max-h-screen bg-gray-50 dark:bg-gray-900">
        {/* === Conteúdo principal centralizado === */}
        <div className="flex flex-col justify-center max-h-[100vh] items-center flex-grow px-4">
          <div className="w-full max-w-7xl">
            <SignUpForm />
          </div>
        </div>

        {/* === Rodapé fixado no fim === */}
        <footer className="text-center py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
          © 2025 <span className="font-semibold">Aliance ERP</span> — Todos os
          direitos reservados. CNPJ: 59.742.573/0001-33
        </footer>
      </div>
    </>
  );
}
