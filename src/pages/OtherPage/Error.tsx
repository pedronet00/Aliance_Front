import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Error() {
  return (
    <>
      <PageMeta
        title="React.js 404 Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js 404 Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      {/* Wrapper principal com altura fixa de 85vh */}
      <div className="relative flex items-center justify-center p-6 overflow-hidden z-1 h-[80vh] max-h-[85vh]">

        {/* Wrapper interno com scroll se necessário */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mx-auto w-full max-w-5xl overflow-y-auto">

          {/* Imagem */}
          <div className="flex-shrink-0">
            <img
              src="/images/vectors/error.png"
              alt="404"
              className="dark:hidden w-120 sm:w-100 max-h-[80vh] object-contain"
            />
            <img
              src="/images/vectors/error.png"
              alt="404"
              className="hidden dark:block w-120 sm:w-100 max-h-[80vh] object-contain"
            />
          </div>

          {/* Textos */}
          <div className="text-center sm:text-left max-w-md">
            <h1 className="mb-4 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
              Ops!
            </h1>

            <p className="mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
              Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
