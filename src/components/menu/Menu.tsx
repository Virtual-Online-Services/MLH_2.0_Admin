import { Link } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../data";
import { logout } from "../../pages/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      // console.log(error);
    }
  };
  return (
    <div className="menu">
      {menu.map((item) => (
        <div className="item" key={item?.id}>
          <span className="title">{item?.title}</span>
          {item?.listItems.map((listItem) => (
            <>
              <Link to={listItem?.url} className="listItem" key={listItem?.id}>
                {/* <img src={listItem?.icon} className="text-dark" alt="" /> */}
                <i className={`${listItem?.icon}`}></i>
                <span className="listItemTitle mt-1">{listItem?.title}</span>
              </Link>
            </>
          ))}
        </div>
      ))}
      <a href="#" onClick={() => handleLogout()}>
        <i className="fa fa-sign-out mb-3"></i>
        <span> Logout</span>
      </a>
    </div>
  );
};

export default Menu;
