import "./analytics.scss";
import useGetSummary from "../../react-query/api-hooks/useGetSummary.js";

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

  if (isLoadingSummaryData) {
    return <div className="small-text">Loading...</div>;
  }

  // Display only selected dashboard metrics
  const activities = [
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

  return (
    <div className="topBox small-container">
      <h5>Dashboard Summary</h5>
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
    </div>
  );
};

export default Analytics;
