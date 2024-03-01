import Home from "../pages/home/Home";
import Users from "../pages/users/Users";
import UserLogin from "../pages/login/UserLogin";
import Advert from "../pages/advert/Advert";
import Operators from "../pages/lotto-operators/Operators";
import Games from "../pages/lotto-games/Games";
import GameDateTime from "../pages/lotto-games/GameDateTime";
import AllTransactions from "../pages/transaction/AllTransactions";
import UserRequestWithdraw from "../pages/withdraw/UserRequestWithdraw";
import RegisterAdmin from "../pages/admin/RegisterAdmin";
import AllResults from "../pages/results/AllResults";
import MessageUser from "../pages/messages/MessageUser";
import SingleUserMessage from "../pages/messages/SingleUserMessage";
import AdminProfile from "../pages/admin/AdminProfile";
import PasswordReset from "../pages/resetpassword/PasswordReset";
import ListCommission from "../pages/agent/ListCommission";
import ListTransaction from "../pages/agent/ListTransaction";
import ListUsers from "../pages/agent/ListUsers";
import SportOperators from "../pages/sports/SportOperators";
import SportAffilates from "../pages/sports/SportAffilates";
import SportCode from "../pages/sports/SportCode";

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
    id: 9,
    path: "/all-withdraw",
    element: <UserRequestWithdraw />,
    protected: true,
  },
  {
    id: 10,
    path: "/register-admin",
    element: <RegisterAdmin />,
    protected: true,
  },
  {
    id: 11,
    path: "/results",
    element: <AllResults />,
    protected: true,
  },
  {
    id: 12,
    path: "/all-message",
    element: <MessageUser />,
    protected: true,
  },
  {
    id: 13,
    path: "/single-user-message",
    element: <SingleUserMessage />,
    protected: true,
  },
  {
    id: 14,
    path: "/admin-profile",
    element: <AdminProfile />,
    protected: true,
  },
  {
    id: 15,
    path: "/reset-password",
    element: <PasswordReset />,
    protected: true,
  },
  {
    id: 16,
    path: "/agent-commission",
    element: <ListCommission />,
    protected: true,
  },
  {
    id: 17,
    path: "/agent-transaction",
    element: <ListTransaction />,
    protected: true,
  },
  {
    id: 18,
    path: "/agent-users",
    element: <ListUsers />,
    protected: true,
  },
  {
    id: 19,
    path: "/sport-operator",
    element: <SportOperators />,
    protected: true,
  },
  {
    id: 20,
    path: "/sport-affiliates",
    element: <SportAffilates />,
    protected: true,
  },
  {
    id: 21,
    path: "/sport-codes",
    element: <SportCode />,
    protected: true,
  },
];
