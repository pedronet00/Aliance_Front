import { FolderSearch } from "lucide-react";

export default function NoData() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-10 my-16 mx-auto w-full max-w-4xl text-center bg-white/60 dark:bg-gray-800/10 border-2 border-dashed border-gray-200/80 dark:border-gray-800/80 rounded-[2.5rem] transition-all duration-300 hover:border-brand-400 dark:hover:border-brand-500/50 hover:bg-brand-50/40 dark:hover:bg-brand-900/10 group shadow-sm hover:shadow-md">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-brand-400 dark:bg-brand-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 group-hover:scale-125 transition-all duration-700" />
        <div className="absolute inset-0 bg-blue-300 dark:bg-blue-600 rounded-full blur-2xl opacity-10 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative w-28 h-28 flex items-center justify-center rounded-[2.5rem] bg-white dark:bg-gray-900 shadow-md border border-gray-100/50 dark:border-gray-800/80 transition-transform duration-500 group-hover:-translate-y-2">
          <FolderSearch className="w-12 h-12 text-brand-500 dark:text-brand-400 opacity-90 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100 tracking-tight">
        Nenhum registro encontrado
      </h2>
      <p className="text-gray-500 text-lg max-w-md mx-auto dark:text-gray-400 font-medium leading-relaxed">
        Não há dados disponíveis para exibir aqui neste momento. Os novos cadastros que você fizer aparecerão automaticamente nesta lista.
      </p>
    </div>
  );
}
