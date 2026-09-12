import "./topBox.scss";
import { MdInsights } from "react-icons/md";
import useGetPlayActivity from "../../react-query/api-hooks/useGetPlayActivity.js";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";

const TopBox = () => {
  const { dashboardData, isLoadingData } = useGetPlayActivity();

  const isError = !!dashboardData && dashboardData.status !== "successful";

  const activities =
    dashboardData && dashboardData.status === "successful"
      ? [
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
          {
            name: "Gd Ghana",
            today: dashboardData.gd_ghana_today,
            all: dashboardData.gd_ghana_all,
          },
          {
            name: "Gd Lotto",
            today: dashboardData.gd_lotto_today,
            all: dashboardData.gd_lotto_all,
          },
          {
            name: "Gd Jackpot",
            today: dashboardData.gd_jackpot_today,
            all: dashboardData.gd_jackpot_all,
          },
          {
            name: "NNP",
            today: dashboardData.nnp_today,
            all: dashboardData.nnp_all,
          },
        ]
      : [];

  const state = deriveViewState({
    isLoading: isLoadingData,
    isError,
    data: activities,
  });

  return (
    <div className="topBox">
      <h1 className="topBox__title">
        <MdInsights className="topBox__titleIcon" aria-hidden="true" />
        <span>Play Activity</span>
      </h1>
      <WidgetStateView
        state={state}
        loadingLabel="Loading play activity…"
        emptyMessage="No play activity"
        errorMessage="Failed to load data"
      >
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
      </WidgetStateView>
    </div>
  );
};

export default TopBox;
