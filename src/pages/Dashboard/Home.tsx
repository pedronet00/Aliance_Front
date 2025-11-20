import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "@/api/apiClient";
import { useEffect, useState } from "react";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import OnboardingChecklist from "./OnboardingChecklist";


interface VendasPorMes {
  ano: number;
  mes: number;
  valorTotal: number;
}

interface DashboardData {
  incomeTotals: { month: number; total: number }[];
  expenseTotals: { month: number; total: number }[];
  totalUsers: number;
  totalPatrimonies: number;
  totalEvents: number;
  totalBudgets: number;
}

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    incomeTotals: [],
    expenseTotals: [],
    totalUsers: 0,
    totalPatrimonies: 0,
    totalEvents: 0,
    totalBudgets: 0,
  });
  const [loading, setLoading] = useState(true);
  const [year] = useState(new Date().getFullYear());
  const [showDashboard, setShowDashboard] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get(`/Dashboard/${year}`);
      setDashboardData(res.data);

      if(res.data.totalBudgets > 0 && res.data.totalEvents > 0 && res.data.totalPatrimonies > 0 && res.data.totalUsers > 0) {
        setShowDashboard(false);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando dashboard...</p>;

  return (
    <>
      <PageMeta
        title="Dashboard | Sistema Aliance"
        description="Resumo e estatísticas financeiras"
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-12 xl:col-span-12">
          {showDashboard == true && (
        <OnboardingChecklist totalEvents={dashboardData.totalEvents} totalBudgets={dashboardData.totalBudgets} totalMembers={dashboardData.totalUsers} totalPatrimonies={dashboardData.totalPatrimonies} />
          )}  
        {/* Métricas gerais */}
          <EcommerceMetrics
            totalUsers={dashboardData.totalUsers}
            totalSales={0}
          />

          {/* Gráfico de entradas e saídas */}
          <MonthlySalesChart
            incomes={dashboardData.incomeTotals}
            expenses={dashboardData.expenseTotals}
            year={year}
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* <RecentOrders /> */}
        </div>
      </div>
    </>
  );
}
