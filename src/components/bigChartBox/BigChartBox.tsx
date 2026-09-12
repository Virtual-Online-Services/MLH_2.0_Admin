import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import "./bigChartBox.scss";
import useGetPlayActivity from "../../react-query/api-hooks/useGetRevenue.js";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";
import { seriesColor } from "../../styles/chartColors";

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

// Series definitions (same data keys / metrics as before). Colors come from the
// Design_System chart palette (Req 6.2) rather than hard-coded literals.
const seriesKeys = [
  "Wesco",
  "GhanaGames",
  "Lottomania",
  "GreenLotto",
  "SetLotto",
  "GDGhana",
  "GDJackpot",
  "GDNNP",
  "GDLotto",
];

const BigChartBox = () => {
  const { dashboardData, isLoadingData } = useGetPlayActivity();

  const isError = Boolean(
    !isLoadingData && (!dashboardData || dashboardData.status !== "successful")
  );

  const chartData =
    !isLoadingData && !isError
      ? months.map((month, index) => ({
          name: month,
          Wesco: dashboardData.wescoMonthlyTransactions[index] || 0,
          GhanaGames: dashboardData.ghanaGameMonthlyTransactions[index] || 0,
          Lottomania: dashboardData.lottoManiaMonthlyTransactions[index] || 0,
          GreenLotto: dashboardData.greenLottoMonthlyTransactions[index] || 0,
          SetLotto: dashboardData.setLottoMonthlyTransactions[index] || 0,
          GDGhana: dashboardData.GDGhanaMonthlyTransactions[index] || 0,
          GDJackpot: dashboardData.GDJackPotMonthlyTransactions[index] || 0,
          GDNNP: dashboardData.NNPMonthlyTransactions[index] || 0,
          GDLotto: dashboardData.gdlottoMonthlyTransactions[index] || 0,
        }))
      : [];

  // Loading precedes empty evaluation; content renders when data exists
  // (Req 6.4, 6.5, 6.7).
  const state = deriveViewState({
    isLoading: isLoadingData,
    isError,
    data: chartData,
  });

  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <WidgetStateView
        state={state}
        loadingLabel="Loading revenue analytics…"
        emptyMessage="No revenue data"
        errorMessage="Failed to load data"
      >
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
                tick={{ fill: "var(--color-text-secondary)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "none",
                }}
                formatter={(value) =>
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "NGN",
                    minimumFractionDigits: 0,
                  }).format(value)
                }
              />
              {seriesKeys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={seriesColor(index)}
                  fill={seriesColor(index)}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </WidgetStateView>
    </div>
  );
};

export default BigChartBox;
