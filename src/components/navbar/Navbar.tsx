import { useSelector } from "react-redux";

import "./navbar.scss";
import { Switch } from "../switch/Switch";

const Navbar = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const username = userInfo?.data?.username;

  return (
    <div className="navbar">
      <div className="logo">
        <span>
          <img
            src="https://www.mylottohub.com/megzy/images/logo.png"
            alt=""
            height="40"
          />
        </span>
      </div>
      <div className="icons">
        {/* <img src="/search.svg" alt="" className="icon" />
        <img src="/app.svg" alt="" className="icon" /> */}
        {/* <img src="/expand.svg" alt="" className="icon" /> */}
        {/* <div className="notification">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div> */}
        <div className="user">
          <span>
            {" "}
            Welcome <strong>{username}</strong>
          </span>
          <span>
            <Switch />
          </span>
        </div>
        <img src="/settings.svg" alt="" className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
