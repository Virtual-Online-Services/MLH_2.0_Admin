import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./bigChartBox.scss";

const data = [
  {
    name: "Jan",
    Wesco: 4000,
    BabaIjebu: 2400,
    Lottomania: 2400,
  },
  {
    name: "Feb",
    Wesco: 3000,
    BabaIjebu: 1398,
    Lottomania: 2210,
  },
  {
    name: "Mar",
    Wesco: 2000,
    BabaIjebu: 9800,
    Lottomania: 2290,
  },
  {
    name: "Apr",
    Wesco: 2780,
    BabaIjebu: 3908,
    Lottomania: 2000,
  },
  {
    name: "May",
    Wesco: 1890,
    BabaIjebu: 4800,
    Lottomania: 2181,
  },
  {
    name: "Jun",
    Wesco: 2390,
    BabaIjebu: 3800,
    Lottomania: 2500,
  },
  {
    name: "Jul",
    Wesco: 3490,
    BabaIjebu: 4300,
    Lottomania: 2100,
  },
  {
    name: "Aug",
    Wesco: 1900,
    BabaIjebu: 7000,
    Lottomania: 2000,
  },
  {
    name: "Sep",
    Wesco: 200,
    BabaIjebu: 1200,
    Lottomania: 2100,
  },
  {
    name: "Oct",
    Wesco: 6000,
    BabaIjebu: 8000,
    Lottomania: 12100,
  },
  {
    name: "Nov",
    Wesco: 190,
    BabaIjebu: 648,
    Lottomania: 3000,
  },
  {
    name: "Dec",
    Wesco: 7000,
    BabaIjebu: 2242,
    Lottomania: 4100,
  },
];

const BigChartBox = () => {
  return (
    <div className="bigChartBox">
      <h1>Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Lottomania"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="BabaIjebu"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
            <Area
              type="monotone"
              dataKey="Wesco"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;
