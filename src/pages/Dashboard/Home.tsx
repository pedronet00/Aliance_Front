import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import apiClient from "@/api/apiClient";
import { useEffect, useState } from "react";
import OnboardingChecklist from "./OnboardingChecklist";
import { useAuth } from "@/context/AuthContext";
import NextEventsList from "@/components/ecommerce/NextEventsList";
import FinancialTransactionsList from "@/components/ecommerce/FinancialTransactionsList";
import PendingItemsAlert from "@/components/ecommerce/PendingItems";


interface DashboardData {
  incomeTotals: { month: number; total: number }[];
  expenseTotals: { month: number; total: number }[];
  nextEvents: {
    id: number;
    name: string;
    date: string;
    locationName: string;
  }[];
  financialTransactions: {
    incomes: {
      id: number;
      description: string;
      value: number;
      date: string;
    }[];
    expenses: {
      id: number;
      description: string;
      value: number;
      date: string;
    }[];
  };
  totalUsers: number;
  usersGrowthRate: number;
  totalPatrimonies: number;
  totalEvents: number;
  totalDepartments: number;
  totalBranches: number;
  totalWorshipTeams: number;
  totalBudgets: number;
  pendingItems: {
    lateRehearsals: number;
    lateServices: number;
    latePastoralVisits: number;
    lateEvents: number;
    total: number;
  };

}


export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    incomeTotals: [],
    expenseTotals: [],
    nextEvents: [],
    financialTransactions: { incomes: [], expenses: [] },
    totalUsers: 0,
    usersGrowthRate: 0,
    totalPatrimonies: 0,
    totalEvents: 0,
    totalDepartments: 0,
    totalBranches: 0,
    totalWorshipTeams: 0,
    totalBudgets: 0,
    pendingItems: {
      lateRehearsals: 0,
      lateServices: 0,
      latePastoralVisits: 0,
      lateEvents: 0,
      total: 0,
    },

  });

  const [loading, setLoading] = useState(true);
  const [year] = useState(new Date().getFullYear());
  const [showDashboard, setShowDashboard] = useState(true);
  var {can} = useAuth();

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
        <div className="col-span-12 space-y-8 xl:col-span-12">
          {showDashboard == true && (
            <OnboardingChecklist 
            totalEvents={dashboardData.totalEvents} 
            totalBudgets={dashboardData.totalBudgets} 
            totalMembers={dashboardData.totalUsers} 
            totalPatrimonies={dashboardData.totalPatrimonies} />
          )}  

          {dashboardData.pendingItems && (
            <PendingItemsAlert pendingItems={dashboardData.pendingItems} />
          )}
          
        {/* Métricas gerais */}
          <EcommerceMetrics
            usersGrowthRate={dashboardData.usersGrowthRate}
            totalUsers={dashboardData.totalUsers}
            totalDeparments={dashboardData.totalDepartments}
            totalBranches={dashboardData.totalBranches}
            totalWorshipTeams={dashboardData.totalWorshipTeams}
          />

          {/* Eventos + Movimentações */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <NextEventsList events={dashboardData.nextEvents} />

            <FinancialTransactionsList
              incomes={dashboardData.financialTransactions.incomes}
              expenses={dashboardData.financialTransactions.expenses}
            />
          </div>


          {can(["Admin", "Pastor","Financeiro","Secretaria"]) && (
          <MonthlySalesChart
            incomes={dashboardData.incomeTotals}
            expenses={dashboardData.expenseTotals}
            year={year}
          />
          )}
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* <RecentOrders /> */}
        </div>
      </div>
    </>
  );
}
