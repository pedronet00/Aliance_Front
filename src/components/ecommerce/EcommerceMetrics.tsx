import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { BookMarked } from "lucide-react";

interface EcommerceMetricsProps {
  totalUsers: number;
  totalSales: number;
}

export default function EcommerceMetrics({ totalUsers, totalSales }: EcommerceMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6">
      {/* Card 1 */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-sm dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Usuários
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalUsers}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* Card 2 */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 p-6 shadow-sm dark:from-gray-900 dark:to-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BookMarked className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            João 3:16
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
            “Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito,
            para que todo aquele que nele crê não pereça, mas tenha a vida eterna.”
          </p>
        </div>

        <div className="absolute right-4 bottom-4 text-xs text-gray-400 dark:text-gray-500 select-none">
          ✨ Versículo do Dia
        </div>
      </div>


      {/* Card 3
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Vendas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalSales}
            </h4>
          </div>
          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div> */}
    </div>
  );
}
