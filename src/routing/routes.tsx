import Home from "../pages/home/Home";
import Users from "../pages/users/Users";
import UserLogin from "../pages/login/UserLogin";
import Advert from "../pages/advert/Advert";
import Operators from "../pages/lotto-operators/Operators";
import Games from "../pages/lotto-games/Games";
import GameDateTime from "../pages/lotto-games/GameDateTime";
import AllTransactions from "../pages/transaction/AllTransactions";
import UserRequestWithdraw from "../pages/withdraw/UserRequestWithdraw";
// import User from "../pages/user/User";

export const routes = [
  {
    id: 1,
    path: "/",
    element: <UserLogin />,
    protected: false,
  },
  {
    id: 2,
    path: "/home",
    element: <Home />,
    protected: true,
  },
  {
    id: 3,
    path: "/users",
    element: <Users />,
    protected: true,
  },
  {
    id: 4,
    path: "/advert",
    element: <Advert />,
    protected: true,
  },
  {
    id: 5,
    path: "/lotto-operator",
    element: <Operators />,
    protected: true,
  },
  {
    id: 6,
    path: "/lotto-game",
    element: <Games />,
    protected: true,
  },
  {
    id: 7,
    path: "/game-datetime/:id",
    element: <GameDateTime />,
    protected: true,
  },
  {
    id: 8,
    path: "/all-transactions",
    element: <AllTransactions />,
    protected: true,
  },
  {
    id: 8,
    path: "/all-withdraw",
    element: <UserRequestWithdraw />,
    protected: true,
  },
];
