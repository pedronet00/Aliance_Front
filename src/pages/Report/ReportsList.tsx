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

  const handleGenerate = async (reportId: string, endpoint: string) => {
    try {
      setLoadingId(reportId);

      const res = await apiClient.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
        link.href = url;
        link.download = `${reportId}.pdf`;
        link.click();

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
        handleGenerate("relatorio-financeiro", "/FinancialReport/pdf"),
    },
    // {
    //   id: "attendance",
    //   title: "Relatório de Presença",
    //   description: "Resumo de presenças por culto, eventos e ministérios.",
    //   icon: <CalendarRange className="size-5 text-purple-600 dark:text-purple-400" />,
    //   action: () =>
    //     handleGenerate("attendance", "/Reports/AttendanceReport"),
    // },
    // {
    //   id: "members",
    //   title: "Relatório de Membros",
    //   description: "Lista de membros, cargos, status e informações gerais.",
    //   icon: <FileText className="size-5 text-emerald-600 dark:text-emerald-400" />,
    //   action: () =>
    //     handleGenerate("members", "/Reports/MembersReport"),
    // },
    // {
    //   id: "tithes",
    //   title: "Relatório de Dízimos",
    //   description: "Resumo de todos os dízimos recebidos por período.",
    //   icon: <BarChart3 className="size-5 text-orange-600 dark:text-orange-400" />,
    //   action: () =>
    //     handleGenerate("tithes", "/Reports/TithesReport"),
    // },
  ];

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white/90">
          Relatórios Disponíveis
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gere relatórios consolidados da sua igreja. Novos relatórios serão
          adicionados automaticamente à lista.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border rounded-xl p-5 shadow-sm dark:border-gray-700 dark:bg-white/[0.03]"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{report.icon}</div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white/90">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {report.description}
                </p>

                <button
                  onClick={report.action}
                  disabled={loadingId === report.id}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingId === report.id ? (
                    <span>Gerando...</span>
                  ) : (
                    <>
                      <FileText className="size-4" />
                      Gerar Relatório
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
