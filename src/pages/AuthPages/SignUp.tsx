import PageMeta from "../../components/common/PageMeta";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Registre-se | Aliance ERP para igrejas"
        description="Essa é a página de registro do Aliance."
      />

      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* === Conteúdo principal centralizado === */}
        <div className="flex flex-col justify-center items-center flex-grow px-4">
          <div className="w-full max-w-5xl">
            {/* Cabeçalho com logo e texto lado a lado */}
            <header className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              {/* Logo à esquerda */}
              <img
                src="/images/logo/PNG PRETO.png"
                alt="Logo Aliance"
                className="w-40 md:w-18"
              />

              {/* Texto ao lado direito */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Bem-vindo ao Aliance | ERP para igrejas
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cadastre-se para começar a gerenciar suas operações de forma simples e eficiente. <br/><b><a href="/login">Já tem uma conta?</a></b>
                </p>
              </div>
            </header>

            {/* Formulário */}
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
