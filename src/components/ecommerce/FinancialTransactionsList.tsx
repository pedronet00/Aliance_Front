import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: number;
  description: string;
  value: number;
  date: string;
}

interface FinancialTransactionsListProps {
  incomes: Transaction[];
  expenses: Transaction[];
}

type UnifiedTransaction = Transaction & {
  type: "income" | "expense";
};

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

export default function FinancialTransactionsList({
  incomes,
  expenses,
}: FinancialTransactionsListProps) {
  const transactions: UnifiedTransaction[] = [
    ...incomes.map(i => ({ ...i, type: "income" })),
    ...expenses.map(e => ({ ...e, type: "expense" })),
  ].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
        Movimentações de hoje
      </h3>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar">
        {transactions.map(item => {
          const isIncome = item.type === "income";

          return (
            <div
              key={`${item.type}-${item.id}`}
              className={`rounded-xl p-3 ${
                isIncome
                  ? "bg-green-50 dark:bg-green-950/40"
                  : "bg-red-50 dark:bg-red-950/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex items-center gap-2 ${
                    isIncome
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownLeft size={18} />
                  )}
                  <span>{item.description}</span>
                </div>

                <span
                  className={`font-semibold ${
                    isIncome
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  {isIncome ? "+" : "-"} R$ {item.amount}
                </span>
              </div>

              <span
                className={`mt-1 block text-xs ${
                  isIncome
                    ? "text-green-700/70 dark:text-green-300/70"
                    : "text-red-700/70 dark:text-red-300/70"
                }`}
              >
                {formatDateTime(item.date)}
              </span>
            </div>
          );
        })}

        {transactions.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhuma movimentação hoje.
          </p>
        )}
      </div>
    </div>
  );
}
