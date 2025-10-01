import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface VendasPorMes {
  ano: number;
  mes: number;
  valorTotal: number;
}

interface MonthlySalesChartProps {
  vendasPorMes: VendasPorMes[];
}

export default function MonthlySalesChart({ vendasPorMes = [] }: MonthlySalesChartProps) {
  // Garantir que todos os 12 meses tenham valor (0 se não houver vendas)
  const seriesData = Array(12).fill(0);
  vendasPorMes.forEach(v => {
    seriesData[v.mes - 1] = v.valorTotal; // array zero-based
  });

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "20%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: { show: true, position: "top", horizontalAlign: "left", fontFamily: "Outfit" },
    yaxis: { title: { text: undefined } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { x: { show: false }, y: { formatter: (val: number) => `${val}` } },
  };

  const series = [{ name: "Vendas", data: seriesData }];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Total de vendas por mês (R$)</h3>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={250} />
        </div>
      </div>
    </div>
  );
}
