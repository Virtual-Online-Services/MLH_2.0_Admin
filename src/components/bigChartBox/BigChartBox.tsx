import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import "./bigChartBox.scss";
import useGetPlayActivity from "../../react-query/api-hooks/useGetRevenue.js";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const BigChartBox = () => {
  const { dashboardData, isLoadingData } = useGetPlayActivity();

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  if (!dashboardData || dashboardData.status !== "successful") {
    return <div>Failed to load data</div>;
  }

  const chartData = months.map((month, index) => ({
    name: month,
    Wesco: dashboardData.wescoMonthlyTransactions[index] || 0,
    GhanaGames: dashboardData.ghanaGameMonthlyTransactions[index] || 0,
    Lottomania: dashboardData.lottoManiaMonthlyTransactions[index] || 0,
    GreenLotto: dashboardData.greenLottoMonthlyTransactions[index] || 0,
    SetLotto: dashboardData.setLottoMonthlyTransactions[index] || 0,
  }));

  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              padding={{ left: 10, right: 10 }}
              tickMargin={10}
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "NGN",
                  minimumFractionDigits: 0,
                }).format(value)
              }
            />
            <Area
              type="monotone"
              dataKey="Wesco"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="GhanaGames"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
            <Area
              type="monotone"
              dataKey="Lottomania"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="GreenLotto"
              stackId="1"
              stroke="#000675"
              fill="#000675"
            />
            <Area
              type="monotone"
              dataKey="SetLotto"
              stackId="1"
              stroke="#ccc000"
              fill="#ccc000"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
