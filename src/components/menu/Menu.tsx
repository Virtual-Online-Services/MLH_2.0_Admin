import { useState } from "react";
import { Link } from "react-router-dom";
import "./menu.scss";
import { menu } from "../../data";
import { logout } from "../../pages/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const MenuItem = ({ item }) => {
  const [isActive, setIsActive] = useState(false);
  const usernamePermission = useSelector((state) => state.auth.userInfo);
  // console.log(usernamePermission?.permission);

  const hasPermission = (menuItem: any) => {
    return usernamePermission?.permission?.includes(menuItem?.permission);
  };

  const handleItemClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      className={`item ${isActive ? "active" : ""}`}
      onClick={handleItemClick}
    >
      <span className="title">{item?.title}</span>
      {/* {item?.listItems &&
        item.listItems.map((listItem) => (
          <Link to={listItem?.url} className="listItem" key={listItem?.id}>
            <i className={listItem?.icon}></i>
            <span className="listItemTitle mt-1">{listItem?.title}</span>
          </Link>
        ))} */}

      {item?.listItems &&
        item.listItems
          .filter((listItem: any) => hasPermission(listItem)) // Filter by permission
          .map((listItem: any) => (
            <Link to={listItem?.url} className="listItem" key={listItem?.id}>
              <i className={listItem?.icon}></i>
              <span className="listItemTitle mt-1">{listItem?.title}</span>
            </Link>
          ))}

      {item.listItems[1]?.subItems && (
        <div className="subItems">
          {item.listItems[1]?.subItems.map((subItem) => (
            <Link to={subItem.url} className="listItem" key={subItem.id}>
              <i className={subItem?.icon}></i>
              <span className="listItemTitle mt-1">{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

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
        <MenuItem key={item.id} item={item} />
      ))}
      <a href="#" onClick={handleLogout}>
        <i className="fa fa-sign-out mb-3"></i>
        <span> Logout</span>
      </a>
    </div>
  );
};

export default Menu;
