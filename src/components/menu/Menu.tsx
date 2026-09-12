import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./menu.scss";
import { menu } from "../../data";
import { logout } from "../../pages/slices/authSlice";
import { isActive } from "./sidebarState";
import { useSidebar } from "./SidebarContext";

/**
 * Sidebar / Menu component.
 *
 * Renders each Nav_Item with an icon + label, grouped under its Nav_Group
 * title, preserving the same items, routes, and permission filtering as before
 * (Requirements 3.1, 3.6, 3.8, 10.1, 10.3).
 *
 * Drawer behavior (Mobile_Viewport <= md): hidden by default, presented as a
 * drawer. It opens on the Navbar Menu_Toggle and closes on toggle again or
 * after selecting a Nav_Item. The drawer open/close state is shared via
 * `SidebarContext` (driven by the pure `nextDrawerState` state machine); the
 * component also accepts optional `isOpen` / `onNavigate` props so a parent
 * Shell can control it directly and it still degrades gracefully when neither
 * a provider nor props are present (Requirements 3.2, 3.3, 3.4, 3.5).
 *
 * The current route's item is marked active via `isActive` (Requirement 3.7).
 * Every Nav_Item is a keyboard-focusable/activatable link with a visible focus
 * indicator, and icon-only controls (logout) expose an accessible name via
 * `aria-label` (Requirements 9.2, 9.4, 9.5).
 */

interface MenuProps {
  /** Optional controlled drawer open state (overrides shared context). */
  isOpen?: boolean;
  /** Optional callback invoked after a Nav_Item is selected. */
  onNavigate?: () => void;
}

interface MenuGroup {
  id: number;
  title: string;
  listItems: MenuListItem[];
}

interface MenuListItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  permission: string;
  subItems?: MenuListItem[];
}

const MenuGroupSection = ({
  item,
  currentPath,
  onSelect,
}: {
  item: MenuGroup;
  currentPath: string;
  onSelect: () => void;
}) => {
  // Permission filtering is preserved exactly as before: an item is shown only
  // when the logged-in admin's permissions include the item's permission.
  const usernamePermission = useSelector((state) => state.auth.userInfo);
  const hasPermission = (menuItem: MenuListItem) => {
    return usernamePermission?.permission?.includes(menuItem?.permission);
  };

  const renderNavItem = (listItem: MenuListItem) => {
    const active = isActive(listItem?.url, currentPath);
    return (
      <Link
        to={listItem?.url}
        className={`listItem ${active ? "active" : ""}`}
        key={listItem?.id}
        aria-current={active ? "page" : undefined}
        onClick={onSelect}
      >
        <i className={listItem?.icon} aria-hidden="true"></i>
        <span className="listItemTitle">{listItem?.title}</span>
      </Link>
    );
  };

  return (
    <div className="item">
      <span className="title">{item?.title}</span>
      {item?.listItems &&
        item.listItems
          .filter((listItem: MenuListItem) => hasPermission(listItem)) // Filter by permission
          .map((listItem: MenuListItem) => renderNavItem(listItem))}

      {item.listItems[1]?.subItems && (
        <div className="subItems">
          {item.listItems[1]?.subItems.map((subItem: MenuListItem) =>
            renderNavItem(subItem)
          )}
        </div>
      )}
    </div>
  );
};

const Menu = ({ isOpen, onNavigate }: MenuProps = {}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Shared drawer state (consistent with the Navbar Menu_Toggle). Optional
  // props take precedence so a parent Shell can fully control the drawer; when
  // neither props nor a provider exist, `useSidebar` returns a safe default.
  const { state, close } = useSidebar();
  const open = isOpen ?? state === "open";

  // Close the drawer after selecting a Nav_Item on Mobile_Viewport
  // (Requirement 3.5). Prefer the caller-supplied callback, then the shared
  // context; both degrade gracefully when absent.
  const handleSelect = () => {
    if (onNavigate) {
      onNavigate();
    } else {
      close();
    }
  };

  const handleLogout = () => {
    try {
      dispatch(logout());
      navigate("/");
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <nav
      className={`menu ${open ? "open" : ""}`}
      aria-label="Primary navigation"
    >
      {(menu as MenuGroup[]).map((item) => (
        <MenuGroupSection
          key={item.id}
          item={item}
          currentPath={location.pathname}
          onSelect={handleSelect}
        />
      ))}
      <button
        type="button"
        className="logout"
        aria-label="Logout"
        onClick={handleLogout}
      >
        <i className="fa fa-sign-out" aria-hidden="true"></i>
        <span className="listItemTitle">Logout</span>
      </button>
    </nav>
  );
};

export default Menu;
