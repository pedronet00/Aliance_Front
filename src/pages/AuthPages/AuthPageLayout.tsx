import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Lado esquerdo com imagem e cor de destaque */}
      <div
        className="hidden md:flex flex-col justify-between items-center w-1/2 text-white p-10"
        style={{
          backgroundColor: "#0e357a",
          backgroundImage:
            "url('/images/backgrounds/login-background.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Sobreposição escura para legibilidade */}
        <div className="absolute inset-0 bg-black opacity-90" />

        <div className="relative z-10 w-full flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo/PNG BRANCO.png" alt="Logo" width={120} />
          </Link>
        </div>

        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white tracking-wide">
            Bem-vindo ao Aliance
          </h1>
          <p className="text-gray-200 max-w-md mx-auto leading-relaxed">
            Um espaço para servir, conectar e crescer em fé.
          </p>
        </div>

        <div className="relative z-10 text-center text-gray-300 text-sm italic">
          “Porque dele, e por ele, e para ele, são todas as coisas.
          Glória, pois, a ele, eternamente. Amém.”  
          <br />
          <span className="text-white font-semibold">Romanos 11:36</span>
        </div>
      </div>

      {/* Lado direito com o formulário */}
      <div
        style={{ backgroundColor: "#fffaff" }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 dark:bg-gray-900 relative"
      >
        <div className="absolute top-6 right-6 sm:block">
          {/* Opcional: ativar se quiser o alternador de tema */}
          {/* <ThemeTogglerTwo /> */}
        </div>

        {/* Logo visível apenas no mobile */}
        <Link to="/" className="md:hidden mb-8 block">
          <img width={100} src="/images/logo/PNG PRETO.png" alt="Logo" />
        </Link>

        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          {children}
        </div>

        <p className="mt-6 text-center text-gray-600 dark:text-white/60 md:hidden text-sm italic">
          "Porque dele, e por ele, e para ele, são todas as coisas.  
          Glória, pois, a ele, eternamente. Amém."  
          <br />
          <span className="font-semibold text-[#0e357a]">Romanos 11:36</span>
        </p>
      </div>
    </div>
  );
}
