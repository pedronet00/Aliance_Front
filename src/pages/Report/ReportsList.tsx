import { FileText, BarChart3, Wallet, CalendarRange } from "lucide-react";
import { useState } from "react";
import apiClient from "@/api/apiClient";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  action: () => void;
}

export default function ReportsList() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const handleGenerate = async (reportId: string, endpoint: string) => {
    try {
      setLoadingId(reportId);

      const res = await apiClient.get(endpoint, {
        responseType: "blob",
      });

      const htmlText = await res.data.text();
      const blob = new Blob([htmlText], { type: "text/html;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportId}.html`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erro ao gerar relatório:", e);
    } finally {
      setLoadingId(null);
    }
  };

  const reports: ReportItem[] = [
    {
      id: "relatorio-financeiro",
      title: "Relatório Financeiro",
      description:
        "Entradas, saídas, dízimos, saldo e totais consolidados do período.",
      icon: <Wallet className="size-5 text-blue-600 dark:text-blue-400" />,
      action: () =>
        handleGenerate("relatorio-financeiro", "/Report/financialReport"),
    },
    {
      id: "members",
      title: "Relatório de Membros",
      description: "Lista de membros, cargos, status e informações gerais.",
      icon: <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />,
      action: () => handleGenerate("members", "/Report/userReport"),
    },
  ];

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
          Relatórios Disponíveis
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gere relatórios consolidados da sua igreja.
        </p>

        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mt-4 w-full rounded-lg border px-3 py-2 dark:bg-white/5 dark:border-gray-700"
        />
      </header>

      <ul className="divide-y rounded-xl border dark:border-gray-700 dark:divide-gray-700">
        {filteredReports.map((report) => (
          <li key={report.id} className="p-4 flex items-center gap-4">
            <div>{report.icon}</div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white/90">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {report.description}
              </p>
            </div>

            <button
              onClick={report.action}
              disabled={loadingId === report.id}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingId === report.id ? (
                <span>Gerando...</span>
              ) : (
                <>
                  <FileText className="size-4" />
                  Gerar
                </>
              )}
            </button>
          </li>
        ))}

        {filteredReports.length === 0 && (
          <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhum relatório encontrado.
          </li>
        )}
      </ul>
    </section>
  );
}
