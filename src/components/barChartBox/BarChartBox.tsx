import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import "./barChartBox.scss";
import useGetTotalVisit from "../../react-query/api-hooks/useGetTotalVisit";

type Props = {
  title: string;
  color: string;
  dataKey: string;
};

const BarChartBox = (props: Props) => {
  const { dashboardData, isLoadingData } = useGetTotalVisit();

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

  if (!dashboardData || dashboardData.status !== "successful") {
    return <div>Failed to load data</div>;
  }

  const chartData = Object.entries(dashboardData.daily_visits).map(
    ([month, value]) => ({
      name: month.substring(0, 3),
      [props.dataKey]: value,
    })
  );

  return (
    <div className="barChartBox">
      <h1>{props.title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={200}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <Tooltip
              labelStyle={{ display: "none" }}
              cursor={{ fill: "none" }}
            />
            <Bar dataKey={props.dataKey} fill={props.color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
