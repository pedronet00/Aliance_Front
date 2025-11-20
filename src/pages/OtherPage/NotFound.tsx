import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="React.js 404 Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js 404 Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />

        {/* Container com imagem e textos lado a lado */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mx-auto w-full max-w-4xl">

          {/* Imagem */}
          <div className="flex-shrink-0">
            <img src="/images/vectors/no-data.jpg" alt="404" className="dark:hidden w-120 sm:w-120" />
            <img src="/images/vectors/no-data.jpg" alt="404" className="hidden dark:block w-120 sm:w-120" />
          </div>

          {/* Textos */}
          <div className="text-center sm:text-left max-w-md">
            <h1 className="mb-4 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
              Ops!
            </h1>
            <p className="mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
              Não encontramos a página que você estava procurando.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Voltar ao início
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Aliance | ERP para igrejas
        </p>
      </div>
    </>
  );
}

