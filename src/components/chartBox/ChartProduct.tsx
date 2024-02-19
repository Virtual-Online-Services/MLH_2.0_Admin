import { Link } from "react-router-dom";
import "./chartBox.scss";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = {
  defaultProduct: number | string;
};

const ChartProduct = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          {props.defaultProduct ? (
            <span>Default Product</span>
          ) : (
            <h1>Default Product</h1>
          )}
        </div>
        {props.defaultProduct !== null ? (
          <h1>{props.defaultProduct}</h1>
        ) : (
          <small>No default product</small>
        )}
        <Link to="#" style={{ color: "#8884d8" }}>
          View all
        </Link>
      </div>
      <div className="chartInfo">
        <div className="chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={props.defaultProduct}>
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
            style={{ color: props.defaultProduct < 0 ? "tomato" : "limegreen" }}
          >
            {props.defaultProduct}%
          </span>
          <span className="duration">this month</span>
        </div> */}
      </div>
    </div>
  );
};

export default ChartProduct;
