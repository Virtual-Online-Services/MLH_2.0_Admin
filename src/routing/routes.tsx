import Home from "../pages/home/Home";
import Users from "../pages/users/Users";
// import Navbar from "../components/navbar/Navbar";
// import Footer from "../components/footer/Footer";
// import Menu from "../components/menu/Menu";
import UserLogin from "../pages/login/UserLogin";
import Advert from "../pages/advert/Advert";
import Operators from "../pages/lotto-operators/Operators";

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
];
