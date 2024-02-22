import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  total_user: number | string;
};

const ChartBox = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          {/* <img src={props.icon} alt="" /> */}
          {/* <span>{props.title}</span> */}
          {props.total_user ? <span>Total users</span> : <h1>Total users</h1>}
        </div>
        <h1>{props.total_user}</h1>
        <Link to="/users" style={{ color: "#8884d8" }}>
          View all
        </Link>
      </div>
      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.total_user}>
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
            style={{ color: props.total_user < 0 ? "tomato" : "limegreen" }}
          >
            {props.total_user}%
          </span>
          <span className="duration">this month</span>
        </div> */}
      </div>
    </div>
  );
};

export default ChartBox;
