import { CheckIcon, CircleIcon } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
      {/* Imagem à esquerda */}
      <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
        <img
          src="/images/vectors/champion.png"
          alt="Onboarding Illustration"
          className="max-w-xs w-full h-auto object-contain"
        />
      </div>

      {/* Checklist à direita */}
      <div className="w-full md:w-1/2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          🧭 Onboarding — primeiros passos
        </h2>

        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-5">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                task.completed
                  ? "border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="mt-1">
                {task.completed ? (
                  <CheckIcon className="text-emerald-500 size-5" />
                ) : (
                  <CircleIcon className="text-gray-400 size-5" />
                )}
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    task.completed
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {task.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm text-gray-500 dark:text-gray-400 text-center">
          {completedCount} de {tasks.length} tarefas concluídas
        </p>
      </div>
    </div>
  );
}
