import "./topBox.scss";
import useGetPlayActivity from "../../react-query/api-hooks/useGetPlayActivity.js";

const TopBox = () => {
  const { dashboardData, isLoadingData } = useGetPlayActivity();

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  if (!dashboardData || dashboardData.status !== "successful") {
    return <div>Failed to load data</div>;
  }

  const activities = [
    {
      name: "Green Lotto",
      today: dashboardData.green_lotto_today,
      all: dashboardData.green_lotto_all,
    },
    {
      name: "Lottomania",
      today: dashboardData.lottomania_today,
      all: dashboardData.lottomania_all,
    },
    {
      name: "Ghana Game",
      today: dashboardData.ghana_game_today,
      all: dashboardData.ghana_game_all,
    },
    {
      name: "Set Lotto",
      today: dashboardData.set_lotto_today,
      all: dashboardData.set_lotto_all,
    },
    {
      name: "Wesco Lotto",
      today: dashboardData.wesco_lotto_today,
      all: dashboardData.wesco_lotto_all,
    },
    {
      name: "Baba Ijebu Lotto",
      today: dashboardData.babaijebu_lotto_today,
      all: dashboardData.babaijebu_lotto_all,
    },
    {
      name: "Golden Chance Lotto",
      today: dashboardData.goldenchance_lotto_today,
      all: dashboardData.goldenchance_lotto_all,
    },
  ];

  return (
    <div className="topBox">
      <h1>Play Activity</h1>
      <div className="list">
        <div className="d-flex justify-content-between">
          <span className="mb-4">All</span>
          <span className="mb-4">Today</span>
        </div>
        <div>
          {activities.map((activity, index) => (
            <div className="listItem_top" key={index}>
              <div className="user">
                <div className="userTexts">
                  <p className="username mt-3">{activity.name}</p>
                </div>
              </div>
              <span className="amount">
                All: {activity.all} | Today: {activity.today}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBox;
