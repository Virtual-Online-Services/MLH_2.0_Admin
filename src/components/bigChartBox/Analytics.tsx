import "./analytics.scss";
import useGetSummary from "../../react-query/api-hooks/useGetSummary.js";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";

// Helper function to format numbers with commas and two decimals.
const formatNumber = (num) => {
  const number = Number(num);
  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Analytics = () => {
  const { dashboardSummaryData, isLoadingSummaryData } = useGetSummary();

  // Same selected dashboard metrics as before, built only when not loading.
  const activities = isLoadingSummaryData
    ? []
    : [
        {
          name: "Total Admin Transfer",
          value: dashboardSummaryData?.total_Admin_transfer,
        },
        {
          name: "Total Bonus Earned",
          value: dashboardSummaryData?.total_bonus_earned,
        },
        {
          name: "Total Bonus Played",
          value: dashboardSummaryData?.total_bonus_played,
        },
        {
          name: "Total Deposit",
          value: dashboardSummaryData?.total_deposit,
        },
      ];

  // Loading precedes empty evaluation; content renders when data exists
  // (Req 6.4, 6.5, 6.7).
  const state = deriveViewState({
    isLoading: isLoadingSummaryData,
    isError: false,
    data: activities,
  });

  return (
    <div className="topBox small-container">
      <h5>Dashboard Summary</h5>
      <WidgetStateView
        state={state}
        loadingLabel="Loading summary…"
        emptyMessage="No summary data"
      >
        <div className="list">
          {activities.map((activity, index) => (
            <div className="listItem_top small-item" key={index}>
              <p className="small-text">{activity.name}</p>
              <span className="small-text small-value">
                {activity.value !== undefined
                  ? formatNumber(activity.value)
                  : "-"}
              </span>
            </div>
          ))}
        </div>
      </WidgetStateView>
    </div>
  );
};

export default Analytics;
