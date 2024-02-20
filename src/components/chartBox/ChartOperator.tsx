import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  total_operators: number | string;
};

const ChartOperator = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          {/* <img src={props.icon} alt="" /> */}
          {/* <span>{props.title}</span> */}
          {props.total_operators ? (
            <span>Total Operators</span>
          ) : (
            <h1>Total Operators</h1>
          )}
        </div>
        <h1>{props.total_operators}</h1>
        <Link to="/lotto-operator" style={{ color: "#8884d8" }}>
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
                // dataKey={props.dataKey}
                // stroke={props.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* <div className="texts">
          <span
            className="percentage"
            style={{ color: props.total_operators < 0 ? "tomato" : "limegreen" }}
          >
            {props.total_operators}%
          </span>
          <span className="duration">this month</span>
        </div> */}
      </div>
    </div>
  );
};

export default ChartOperator;
