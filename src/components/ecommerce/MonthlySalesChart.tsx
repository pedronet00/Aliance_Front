import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface MonthlyItem {
  month: number;
  total: number;
}

interface MonthlySalesChartProps {
  incomes: MonthlyItem[];
  expenses: MonthlyItem[];
  year: number;
}

export default function MonthlySalesChart({ incomes = [], expenses = [], year }: MonthlySalesChartProps) {
  const incomeData = Array(12).fill(0);
  const expenseData = Array(12).fill(0);

  // Corrige meses inválidos (month = 0) usando o índice do array
  incomes.forEach((i, index) => {
    const monthIndex = i.month >= 1 && i.month <= 12 ? i.month - 1 : index;
    if (monthIndex >= 0 && monthIndex < 12) incomeData[monthIndex] = i.total;
  });

  expenses.forEach((e, index) => {
    const monthIndex = e.month >= 1 && e.month <= 12 ? e.month - 1 : index;
    if (monthIndex >= 0 && monthIndex < 12) expenseData[monthIndex] = e.total;
  });

  const options: ApexOptions = {
    colors: ["#22c55e", "#ef4444"], // verde (income), vermelho (expense)
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val: number) => `R$ ${val.toFixed(2)}` },
    },
  };

  const series = [
    { name: "Entradas", data: incomeData },
    { name: "Saídas", data: expenseData },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {year} | Entradas e saídas por mês (R$)
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={250} />
        </div>
      </div>
    </div>
  );
}
