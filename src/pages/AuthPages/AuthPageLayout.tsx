import React from "react";
import { Link } from "react-router";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* Lado esquerdo - Branding & Quote */}
      <div
        className="hidden md:flex flex-col justify-between items-start w-[45%] lg:w-[42%] text-white p-16 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at top left, #0e357a 0%, #030406 100%)",
        }}
      >
        {/* Background Decorative Mesh & Abstract Shapes */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {/* Decorative Abstract Ellipses */}
        <div className="absolute top-[10%] -left-[10%] w-[60%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] rotate-12" />
        <div className="absolute bottom-[10%] -right-[5%] w-[50%] h-[50%] bg-[#0e357a]/40 rounded-full blur-[100px] -rotate-12" />

        {/* Subtle Glows - Blue focus */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-800 rounded-full blur-[150px] opacity-20" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-950 rounded-full blur-[120px] opacity-20" />

        <div className="relative z-10 w-full">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <img src="/images/logo/PNG BRANCO.png" alt="Logo" width={140} className="drop-shadow-2xl" />
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md text-[11px] uppercase tracking-[0.25em] font-bold text-blue-300">
            Plataforma Aliance
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
            Excelência na <br />
            <span className="text-blue-400">Gestão Eclesiástica</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-sm leading-relaxed">
            Uma solução moderna para igrejas que buscam <span className="text-white">crescimento e organização.</span>
          </p>
        </div>

        <div className="relative z-10 w-full group">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl">
            <p className="text-gray-400 text-lg leading-relaxed italic mb-4">
              “Porque dele, e por ele, e para ele, são todas as coisas.
              Glória, pois, a ele, eternamente. Amém.”
            </p>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-10 bg-blue-600" />
              <span className="text-white text-sm font-bold uppercase tracking-[0.3em]">Romanos 11:36</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative bg-[#0a0c10] md:bg-gray-50 dark:md:bg-gray-950">
        {/* Decorative Elements for the right side (subtle) */}
        <div className="hidden md:block absolute top-0 right-1/4 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-1/4 w-96 h-96 bg-gray-100 dark:bg-gray-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[480px] z-10">
          {/* Logo Mobile Only */}
          <Link to="/" className="md:hidden mb-10 flex justify-center">
            <img width={140} src="/images/logo/PNG PRETO.png" alt="Logo" className="dark:hidden" />
            <img width={140} src="/images/logo/PNG BRANCO.png" alt="Logo" className="hidden dark:block" />
          </Link>

          <div className="bg-white dark:bg-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800 transition-all">
            {children}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              &copy; {new Date().getFullYear()} Aliance. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
