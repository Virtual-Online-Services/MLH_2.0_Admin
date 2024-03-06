import BarChartBox from "../../components/barChartBox/BarChartBox";
import BigChartBox from "../../components/bigChartBox/BigChartBox";
import ChartBox from "../../components/chartBox/ChartBox";
import ChartOperator from "../../components/chartBox/ChartOperator";
import PieChartBox from "../../components/pieCartBox/PieChartBox";
import TopBox from "../../components/topBox/TopBox";
import Menu from "../../components/menu/Menu";
import { barChartBoxRevenue, barChartBoxVisit } from "../../data";
import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import useGetDashBoardInfo from "../../react-query/api-hooks/useGetDashBoardInfo.js";
import ChartGames from "../../components/chartBox/ChartGames.js";
import TopFiveTransactions from "../transaction/TopFiveTransactions";

const Home = () => {
  const { dashboardData, isLoadingData } = useGetDashBoardInfo();
  // console.log(dashboardData);

  return (
    <div className="main">
      <Navbar />
      <div className="container__flex">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <div className="home">
            <div className="box box1">
              <TopBox />
            </div>
            <div className="box box2">
              <ChartBox {...dashboardData} />
            </div>

            <div className="box box3">
              <ChartOperator {...dashboardData} />
            </div>

            {/* <ChartGames /> */}

            <div className="box box4">
              <PieChartBox />
            </div>
            <div className="box box5">
              <ChartGames {...dashboardData} />
            </div>
            {/* <div className="box box6">
              <ChartProduct {...dashboardData} />
            </div> */}
            <div className="box box7">
              <BigChartBox />
            </div>
            <div className="box box8">
              <BarChartBox {...barChartBoxVisit} />
            </div>
            <div className="box box9">
              <BarChartBox {...barChartBoxRevenue} />
            </div>
          </div>
          <div className="mt-5">Top 5 Transactions</div>
          <div className="w-100">
            <TopFiveTransactions />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
