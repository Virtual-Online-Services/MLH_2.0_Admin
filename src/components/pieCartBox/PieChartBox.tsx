import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";
import { CHART_COLORS } from "../../styles/chartColors";

const PieChartBox = () => {
  const { dashboardData, isLoadingData } = useGetDashBoardInfo();

  const isError = Boolean(
    !isLoadingData && (!dashboardData || dashboardData.status !== "successful")
  );

  // Preserve the same winning-stats metrics (Total Pay / Total Win). Build the
  // series only when data is available so it is not derived from error state.
  const data =
    !isLoadingData && !isError
      ? [
          {
            name: "Total Pay",
            value: dashboardData?.total_pay || 0,
            formattedValue: `₦${(
              dashboardData?.total_pay / 1_000_000
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}M`,
            color: CHART_COLORS.danger,
          },
          {
            name: "Total Win",
            value: dashboardData?.total_win || 0,
            formattedValue: `₦${(
              dashboardData?.total_win / 1_000_000
            ).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}M`,
            color: CHART_COLORS.success,
          },
        ]
      : [];

  // Loading precedes empty evaluation; content renders when data exists
  // (Req 6.4, 6.5, 6.7).
  const state = deriveViewState({ isLoading: isLoadingData, isError, data });

  return (
    <div className="pieChartBox">
      <h1>Winning Stats</h1>
      <WidgetStateView
        state={state}
        loadingLabel="Loading winning stats…"
        emptyMessage="No winning stats"
        errorMessage="Failed to load data"
      >
        <div className="chart">
          <ResponsiveContainer width="99%" height={300}>
            <PieChart>
              <Tooltip
                formatter={(value) =>
                  `₦${(value / 1_000_000).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}M`
                }
                contentStyle={{
                  background: "var(--color-surface)",
                  borderRadius: "5px",
                }}
              />
              <Pie
                data={data}
                innerRadius={"70%"}
                outerRadius={"90%"}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="options">
          {data.map((item) => (
            <div className="option" key={item.name}>
              <div className="title">
                <div className="dot" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span>{item.formattedValue}</span>
            </div>
          ))}
        </div>
      </WidgetStateView>
    </div>
  );
};

export default PieChartBox;
