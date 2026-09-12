import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import "./barChartBox.scss";
import useGetTotalVisit from "../../react-query/api-hooks/useGetTotalVisit";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";
import { CHART_COLORS } from "../../styles/chartColors";

type Props = {
  title: string;
  color: string;
  dataKey: string;
};

const BarChartBox = (props: Props) => {
  const { dashboardData, isLoadingData } = useGetTotalVisit();

  const isError = Boolean(
    !isLoadingData && (!dashboardData || dashboardData.status !== "successful")
  );

  // Same total-visits metric as before, keyed by props.dataKey.
  const chartData =
    !isLoadingData && !isError
      ? Object.entries(dashboardData.daily_visits).map(([month, value]) => ({
          name: month.substring(0, 3),
          [props.dataKey]: value,
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
    <div className="barChartBox">
      <h1>{props.title}</h1>
      <WidgetStateView
        state={state}
        loadingLabel="Loading visits…"
        emptyMessage="No visit data"
        errorMessage="Failed to load data"
      >
        <div className="chart">
          <ResponsiveContainer width="99%" height={200}>
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <Tooltip
                labelStyle={{ display: "none" }}
                cursor={{ fill: "none" }}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "none",
                }}
              />
              <Bar dataKey={props.dataKey} fill={CHART_COLORS.brand} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </WidgetStateView>
    </div>
  );
};

export default BarChartBox;
