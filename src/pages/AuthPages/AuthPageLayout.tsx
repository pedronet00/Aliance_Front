import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ backgroundColor: "#fffaff" }}
      className="relative w-full h-screen flex flex-col justify-center items-center p-6 dark:bg-gray-900"
    >
      {/* Logo em cima */}
      <Link to="/" className="block mb-8">
        <img
          width={100}
          src="/images/logo/PNG PRETO.png"
          alt="Logo"
        />
      </Link>

      {/* Formulário */}
      <div className="w-full max-w-sm">{children}</div>

      {/* Versículo embaixo */}
      <p className="mt-8 text-center text-gray-600 dark:text-white/60">
        "Porque dele, e por ele, e para ele, são todas as coisas. Glória, pois, a ele, eternamente. Amém." – Romanos 11:36
      </p>

      {/* Theme Toggler */}
      {/* <div className="fixed z-50 bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div> */}
    </div>
  );
}
