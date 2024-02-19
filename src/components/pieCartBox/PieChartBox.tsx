import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./pieChartBox.scss";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo";

const PieChartBox = () => {
  const { dashboardData, isLoadingData } = useGetDashBoardInfo();

  const data = [
    {
      name: "Total Pay",
      value: dashboardData?.total_pay,
      color: "#fc0202",
    },
    {
      name: "Total Win",
      value: dashboardData?.total_win,
      color: "#00C49F",
    },
  ];

  return (
    <div className="pieChartBox">
      <h1>Winning Stats</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ background: "white", borderRadius: "5px" }}
            />
            <Pie
              data={data}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
              {/* <Cell key={dashboardData.total_pay} /> */}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {data.map((item) => (
          <div className="option" key={item.name}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>₦{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
