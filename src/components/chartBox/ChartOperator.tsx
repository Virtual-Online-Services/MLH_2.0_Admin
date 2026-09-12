import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { deriveViewState } from "../../pages/home/viewState";
import { WidgetStateView } from "../widget-state";
import { CHART_COLORS } from "../../styles/chartColors";

type Props = {
  total_operators: number | string;
};

const ChartOperator = (props: Props) => {
  // Preserve the same metric shown today (total operators). Drive the widget
  // through deriveViewState from the presence of the value so an absent metric
  // shows an Empty_State and a present metric renders content (Req 6.4, 6.5, 6.7).
  const state = deriveViewState({
    isLoading: false,
    isError: false,
    data: props.total_operators,
  });

  return (
    <div className="chartBox">
      <WidgetStateView
        state={state}
        loadingLabel="Loading operators…"
        emptyMessage="No operator data"
      >
        <div className="boxInfo">
          <div className="title">
            {props.total_operators ? (
              <span>Total Operators</span>
            ) : (
              <h1>Total Operators</h1>
            )}
          </div>
          <h1>{props.total_operators}</h1>
          <Link to="/lotto-operator" className="viewAll">
            View all
          </Link>
        </div>
        <div className="chartInfo">
          <div className="chart">
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={props.total_operators}>
                <Tooltip
                  contentStyle={{ background: "transparent", border: "none" }}
                  labelStyle={{ display: "none" }}
                  position={{ x: 10, y: 70 }}
                />
                <Line
                  type="monotone"
                  stroke={CHART_COLORS.brand}
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

export default ChartOperator;
