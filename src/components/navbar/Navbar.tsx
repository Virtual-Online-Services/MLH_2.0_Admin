import { useSelector } from "react-redux";
import "./navbar.scss";
import { Switch } from "../switch/Switch";
import { Link } from "react-router-dom";

const Navbar = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const username = userInfo?.data?.username;

  return (
    <div className="navbar">
      <Link to="/home" className="logo">
        <span>
          <img
            src="https://www.mylottohub.com/megzy/images/logo.png"
            alt=""
            height="40"
          />
        </span>
      </Link>
      <div className="icons">
        <div className="user">
          <span>
            {" "}
            Welcome <strong>{username}</strong>
          </span>
          <span>
            <Switch />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
