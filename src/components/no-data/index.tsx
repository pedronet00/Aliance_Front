import React from "react";

export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src="/images/vectors/no-data.jpg"
        alt="Sem dados"
        className="w-40 h-auto mb-6 opacity-90"
      />
      <h2 className="text-2xl font-semibold mb-2 dark:text-gray-100">
        Nenhum dado disponível
      </h2>
      <p className="text-gray-400 text-md font-medium dark:text-gray-300">
        Você ainda não possui dados para exibir nesta página;
      </p>
    </div>
  );
}
