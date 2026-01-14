import { GroupIcon } from "../../icons";
import { Building2, Target, Music } from "lucide-react";
import { useNavigate } from "react-router";

interface EcommerceMetricsProps {
  totalUsers: number;
  usersGrowthRate: number;
  totalDeparments: number;
  totalBranches: number;
  totalWorshipTeams: number;
}

function getGrowthBadge(growth: number) {
  if (growth > 0) {
    return {
      label: `+${growth}%`,
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    };
  }

  if (growth < 0) {
    return {
      label: `${growth}%`,
      className:
        "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    };
  }

  return {
    label: "0%",
    className:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };
}

export default function EcommerceMetrics({
  totalUsers,
  usersGrowthRate,
  totalDeparments,
  totalBranches,
  totalWorshipTeams,
}: EcommerceMetricsProps) {

  const navigate = useNavigate();
  const growthBadge = getGrowthBadge(usersGrowthRate);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">

      {/* Usuários */}
      <div
        onClick={() => navigate('/membros')}
        className="relative rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm
        dark:border-blue-900/40 dark:bg-blue-950/40
        transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
      >

        {/* Badge de crescimento */}
        <span
  title="Comparado ao mês passado"
  aria-label={`Crescimento de usuários comparado ao mês passado: ${growthBadge.label}`}
  className={`absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-full cursor-help ${growthBadge.className}`}
>
  {growthBadge.label}
</span>



        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl dark:bg-blue-900/40">
            <GroupIcon className="size-6 text-blue-700 dark:text-blue-300" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-blue-700/70 dark:text-blue-300/70">
              Usuários
            </span>
            <span className="mt-1 font-bold text-blue-900 text-xl dark:text-blue-100">
              {totalUsers}
            </span>
          </div>
        </div>
      </div>

      {/* Departamentos */}
      <div
        onClick={() => navigate('/departamentos')}
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm
        dark:border-emerald-900/40 dark:bg-emerald-950/40
        transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl dark:bg-emerald-900/40">
            <Building2 className="size-6 text-emerald-700 dark:text-emerald-300" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-emerald-700/70 dark:text-emerald-300/70">
              Departamentos
            </span>
            <span className="mt-1 font-bold text-emerald-900 text-xl dark:text-emerald-100">
              {totalDeparments}
            </span>
          </div>
        </div>
      </div>

      {/* Missões */}
      <div
        onClick={() => navigate('/missoes')}
        className="rounded-2xl border border-violet-200 bg-violet-50 p-6 shadow-sm
        dark:border-violet-900/40 dark:bg-violet-950/40
        transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl dark:bg-violet-900/40">
            <Target className="size-6 text-violet-700 dark:text-violet-300" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-violet-700/70 dark:text-violet-300/70">
              Filiais
            </span>
            <span className="mt-1 font-bold text-violet-900 text-xl dark:text-violet-100">
              {totalBranches}
            </span>
          </div>
        </div>
      </div>

      {/* Equipes de Louvor */}
      <div
        onClick={() => navigate('/grupos-de-louvor')}
        className="rounded-2xl border border-orange-200 bg-orange-50 p-6 shadow-sm
        dark:border-orange-900/40 dark:bg-orange-950/40
        transition-transform duration-200 ease-out hover:scale-105 cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/40">
            <Music className="size-6 text-orange-700 dark:text-orange-300" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-orange-700/70 dark:text-orange-300/70">
              Equipes de Louvor
            </span>
            <span className="mt-1 font-bold text-orange-900 text-xl dark:text-orange-100">
              {totalWorshipTeams}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
