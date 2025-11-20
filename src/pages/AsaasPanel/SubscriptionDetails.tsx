import { useEffect, useState } from "react";
import {
  CreditCard,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import apiClient from "@/api/apiClient";
import { useAuth } from "@/context/AuthContext";

interface SubscriptionData {
  id: string;
  value: number;
  nextDueDate: string;
  cycle: string;
  billingType: string;
  status: string;
  endDate: string;
  dateCreated: string;
  creditCard?: {
    creditCardNumber: string;
    creditCardBrand: string;
  };
}

interface Payment {
  id: string;
  invoiceNumber: string;
  value: number;
  dueDate: string;
  status: string;
  billingType: string;
  invoiceUrl?: string;
  transactionReceiptUrl?: string;
  clientPaymentDate?: string;
}

export default function SubscriptionOverview() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const subId = user?.subscriptionId ?? "";


  useEffect(() => {
  async function load() {
    try {
      const [subRes, payRes] = await Promise.all([
        apiClient.get(`/User/GetSubscriptionData/${subId}`),
        apiClient.get(`/User/GetSubscriptionPayments/${subId}`),
      ]);

      setSubscription(subRes.data);
      setPayments(payRes.data.data || []);
    } catch (err) {
      console.error("Erro ao buscar dados da assinatura:", err);
    } finally {
      setLoading(false);
    }
  }

  load();
}, []);


  if (loading)
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-10">
        Carregando informações da assinatura...
      </div>
    );

  if (!subscription)
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-10">
        Nenhuma assinatura encontrada.
      </div>
    );

  const statusColor =
    subscription.status === "ACTIVE"
      ? "success"
      : subscription.status === "OVERDUE"
      ? "error"
      : "warning";

  const formattedValue = subscription.value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <section className="space-y-8">
      {/* Cabeçalho */}
      <header className="text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          Painel de Cobranças
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Acompanhe o status da sua assinatura, próxima cobrança e o histórico
          de pagamentos. Para cancelar a sua assinatura, <b>entre em contato com o 
          suporte</b>.
        </p>
      </header>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
        {/* Status */}
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {subscription.status === "ACTIVE" ? (
                <CheckCircle2 className="text-green-600 size-5" />
              ) : (
                <AlertTriangle className="text-yellow-500 size-5" />
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Status
              </span>
            </div>
            <Badge color={statusColor}>
              {subscription.status === "ACTIVE" ? "Ativa" : "Inativa"}
            </Badge>
          </div>
          <p className="mt-2 font-semibold text-gray-800 dark:text-white/90">
            {subscription.status === "ACTIVE"
              ? "Assinatura em dia"
              : subscription.status}
          </p>
        </div>

        {/* Valor e Ciclo */}
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-700 size-5 dark:text-gray-200" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Valor
              </span>
            </div>
            <Badge color="primary">
              {subscription.cycle === "MONTHLY" ? "Mensal" : subscription.cycle}
            </Badge>
          </div>
          <p className="mt-2 font-semibold text-gray-800 dark:text-white/90">
            {formattedValue}
          </p>
          {subscription.creditCard && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {subscription.creditCard.creditCardBrand} ••••{" "}
              {subscription.creditCard.creditCardNumber}
            </p>
          )}
        </div>

        {/* Próxima cobrança */}
        <div className="rounded-xl border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarDays className="text-gray-700 size-5 dark:text-gray-200" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Próxima cobrança
              </span>
            </div>
          </div>
          <p className="mt-2 font-semibold text-gray-800 dark:text-white/90">
            {new Date(subscription.nextDueDate).toLocaleDateString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Início:{" "}
            {new Date(subscription.dateCreated).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Histórico de pagamentos */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
          Histórico de Pagamentos
        </h3>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-100 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3">Fatura</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Data de Pagamento</th>
                <th className="px-4 py-3">Comprovante</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    Nenhuma cobrança encontrada.
                  </td>
                </tr>
              )}

              {payments.map((p) => {
                const statusColor =
                  p.status === "CONFIRMED"
                    ? "text-green-600"
                    : p.status === "PENDING"
                    ? "text-yellow-500"
                    : "text-red-500";

                return (
                  <tr
                    key={p.id}
                    className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-white/90">
                      #{p.invoiceNumber}
                    </td>
                    <td className="px-4 py-3">
                      {p.value.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(p.dueDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className={`px-4 py-3 font-semibold ${statusColor}`}>
                      {p.status === "CONFIRMED"
                        ? "Pago"
                        : p.status === "PENDING"
                        ? "Pendente"
                        : p.status}
                    </td>
                    <td className="px-4 py-3">
                      {p.clientPaymentDate
                        ? new Date(p.clientPaymentDate).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {p.transactionReceiptUrl ? (
                        <a
                          href={p.transactionReceiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <FileText className="size-4" /> Ver
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
