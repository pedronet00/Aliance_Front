import { FileText, Wallet, CalendarRange } from "lucide-react";
import { useState } from "react";
import apiClient from "@/api/apiClient";

interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  endpoint: string;
  useDateFilter?: boolean;
}

export default function ReportsList() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  // controle do relatório com filtro aberto
  const [activeFilterReport, setActiveFilterReport] = useState<string | null>(
    null
  );

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleGenerate = async (report: ReportItem) => {
    try {
      setLoadingId(report.id);

      let url = report.endpoint;

      if (report.useDateFilter) {
        if (!dateFrom || !dateTo) {
          alert("Selecione o período do relatório.");
          setLoadingId(null);
          return;
        }

        const params = new URLSearchParams({
          initialDate: dateFrom,
          endDate: dateTo,
        });

        url = `${url}?${params.toString()}`;
      }

      const res = await apiClient.get(url, {
        responseType: "blob",
      });

      const htmlText = await res.data.text();
      const blob = new Blob([htmlText], {
        type: "text/html;charset=utf-8",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `${report.id}.html`;
      link.click();

      window.URL.revokeObjectURL(downloadUrl);

      // fecha filtro após gerar
      setActiveFilterReport(null);
      setDateFrom("");
      setDateTo("");
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
      endpoint: "/Report/financialReport",
      useDateFilter: true,
    },
    {
      id: "members",
      title: "Relatório de Membros",
      description: "Lista de membros, cargos, status e informações gerais.",
      icon: (
        <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />
      ),
      endpoint: "/Report/userReport",
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
        {filteredReports.map((report) => {
          const isFilterOpen = activeFilterReport === report.id;

          return (
            <li key={report.id} className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div>{report.icon}</div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white/90">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>

                {!report.useDateFilter && (
                  <button
                    onClick={() => handleGenerate(report)}
                    disabled={loadingId === report.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loadingId === report.id ? "Gerando..." : "Gerar"}
                  </button>
                )}

                {report.useDateFilter && (
                  <button
                    onClick={() =>
                      setActiveFilterReport(
                        isFilterOpen ? null : report.id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Gerar
                  </button>
                )}
              </div>

              {/* FILTRO INLINE */}
              {report.useDateFilter && isFilterOpen && (
                <div className="rounded-lg border bg-gray-50 p-4 dark:bg-white/5 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        De
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 dark:bg-white/5 dark:border-gray-700"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400">
                        Até
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 dark:bg-white/5 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setActiveFilterReport(null)}
                      className="text-sm px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={() => handleGenerate(report)}
                      disabled={loadingId === report.id}
                      className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loadingId === report.id ? "Gerando..." : "Gerar Relatório"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}

        {filteredReports.length === 0 && (
          <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Nenhum relatório encontrado.
          </li>
        )}
      </ul>
    </section>
  );
}
