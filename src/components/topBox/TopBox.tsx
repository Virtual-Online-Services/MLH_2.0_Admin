import "./topBox.scss";
import { topDealUsers } from "../../data.js";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo.js";

const TopBox = () => {
  // const { dashboardData, isLoadingData } = useGetDashBoardInfo();
  // console.log(dashboardData);

  return (
    <div className="topBox">
      <h1>Play Activity</h1>
      <div className="list">
        <div className="d-flex justify-content-between">
          <span className="mb-4">All</span>
          <span className="mb-4">Today</span>
        </div>
        <div>
          {topDealUsers.map((user) => (
            <div className="listItem_top" key={user.id}>
              <div className="user">
                <div className="userTexts">
                  <p className="username">{user.username}</p>
                </div>
              </div>
              <span className="amount">{user.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBox;
