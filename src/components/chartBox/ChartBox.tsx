import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { FaUsers } from "react-icons/fa";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";

type Props = {
  total_user: number | string;
  /** Optional loading flag so the card can pass through the shared view-state. */
  isLoading?: boolean;
  /** Optional error flag so the card can pass through the shared view-state. */
  isError?: boolean;
};

const ChartBox = (props: Props) => {
  const { total_user, isLoading = false, isError = false } = props;

  const state = deriveViewState({
    isLoading,
    isError,
    data: total_user,
  });

  return (
    <div className="chartBox">
      <WidgetStateView
        state={state}
        loadingLabel="Loading total users…"
        emptyMessage="No user data"
        errorMessage="Unable to load users"
      >
        <div className="boxInfo">
          <div className="title">
            <FaUsers className="titleIcon" aria-hidden="true" />
            <span>Total users</span>
          </div>
          <h1>{total_user}</h1>
          <Link to="/users" className="viewAll">
            View all
          </Link>
        </div>
        <div className="chartInfo">
          <div className="chart">
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={total_user}>
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none" }}
                  labelStyle={{ display: "none" }}
                  position={{ x: 10, y: 70 }}
                />
                <Line
                  type="monotone"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </WidgetStateView>
    </div>
  );
};

export default ChartBox;
