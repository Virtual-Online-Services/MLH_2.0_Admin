import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  total_games: number | string;
};

const ChartGames = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          {/* <img src={props.icon} alt="" /> */}
          {/* <span>{props.title}</span> */}
          {props.total_games ? <span>Total Games</span> : <h1>Total Games</h1>}
        </div>
        <h1>{props.total_games}</h1>
        <Link to="/lotto-game" style={{ color: "#8884d8" }}>
          View all
        </Link>
      </div>
      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.total_games}>
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
            style={{ color: props.total_games < 0 ? "tomato" : "limegreen" }}
          >
            {props.total_games}%
          </span>
          <span className="duration">this month</span>
        </div> */}
      </div>
    </div>
  );
};

export default ChartGames;
