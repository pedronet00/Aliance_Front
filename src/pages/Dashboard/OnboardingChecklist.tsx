import { CheckCircle2, CircleDashed, Rocket } from "lucide-react";

interface OnboardingChecklistProps {
  totalMembers: number;
  totalPatrimonies: number;
  totalEvents: number;
  totalBudgets: number;
}

export default function OnboardingChecklist({ totalEvents, totalBudgets, totalMembers, totalPatrimonies }: OnboardingChecklistProps) {
  const tasks = [
    {
      id: 1,
      title: "Cadastrar um membro",
      description: "Registre o primeiro membro da sua igreja.",
      completed: totalMembers > 0,
    },
    {
      id: 2,
      title: "Cadastrar um evento",
      description: "Agende o primeiro evento ou culto.",
      completed: totalEvents > 0,
    },
    {
      id: 3,
      title: "Cadastrar um orçamento",
      description: "Crie o orçamento mensal da igreja.",
      completed: totalBudgets > 0,
    },
    {
      id: 4,
      title: "Cadastrar um patrimônio",
      description: "Adicione os bens e equipamentos da igreja.",
      completed: totalPatrimonies > 0
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row items-center gap-8 rounded-[2.5rem] border border-gray-200/60 bg-white p-8 dark:border-gray-800/80 dark:bg-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* Imagem à esquerda */}
      <div className="relative z-10 hidden md:flex flex-shrink-0 w-full md:w-5/12 justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-100/50 to-transparent dark:from-brand-900/20 rounded-full blur-2xl transform scale-75" />
        <img
          src="/images/vectors/champion.png"
          alt="Onboarding Illustration"
          className="relative z-10 max-w-sm w-full h-auto object-contain drop-shadow-xl transform transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Checklist à direita */}
      <div className="relative z-10 w-full md:w-7/12 flex flex-col justify-center">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Rocket size={14} />
            Primeiros Passos
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
            Configure sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-500">Igreja</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Complete estas {tasks.length} etapas fundamentais para tirar o máximo proveito do sistema.
          </p>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-800/50 rounded-full h-2.5 mb-2 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 relative">
          <div
            className="absolute top-0 left-0 bg-gradient-to-r from-brand-400 to-brand-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(70,95,255,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mb-6 text-xs font-bold text-gray-400 dark:text-gray-500">
          <span>{completedCount} concluídas</span>
          <span className="text-brand-500">{Math.round(progress)}%</span>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${task.completed
                  ? "border-emerald-500/30 bg-emerald-50/50 shadow-[0_2px_10px_rgba(16,185,129,0.05)] dark:bg-emerald-500/5 dark:border-emerald-500/20"
                  : "border-gray-200/60 bg-white/50 dark:bg-gray-800/40 dark:border-gray-700/50 shadow-sm hover:border-brand-300 dark:hover:border-brand-500/40 hover:shadow-md hover:bg-white dark:hover:bg-gray-800"
                }`}
            >
              <div className="mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                {task.completed ? (
                  <CheckCircle2 className="text-emerald-500 size-6" />
                ) : (
                  <CircleDashed className="text-gray-300 dark:text-gray-600 size-6 group-hover:text-brand-400 transition-colors" />
                )}
              </div>
              <div>
                <h3
                  className={`font-semibold text-sm mb-0.5 transition-colors ${task.completed
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400"
                    }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400/80 leading-relaxed">
                  {task.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
