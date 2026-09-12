import { useState } from "react";
import { useSelector } from "react-redux";
import "./navbar.scss";
import { Switch } from "../switch/Switch";
import { Link } from "react-router-dom";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { resolveAdminName } from "./resolveAdminName";

/**
 * Props for the Navbar.
 *
 * The Menu_Toggle controls the Sidebar drawer on Mobile_Viewport. To avoid
 * tight coupling with the sibling Sidebar (refactored separately in task 6.1),
 * the Menu_Toggle is a fully controlled button: the parent Shell wires it via
 * these optional props (Requirements 4.4, 9.3):
 *   - `onMenuToggle` — invoked when the Menu_Toggle is activated.
 *   - `isMenuOpen`   — current drawer open state; drives the icon, `aria-label`,
 *                      and `aria-expanded`.
 *
 * Both props are optional so the Navbar stays backward compatible. When they
 * are omitted, the Navbar tracks its own local open state so the toggle still
 * works (and never crashes) when rendered in isolation.
 */
export interface NavbarProps {
  /** Called when the Menu_Toggle (hamburger) is activated. */
  onMenuToggle?: () => void;
  /** Whether the Sidebar drawer is currently open. */
  isMenuOpen?: boolean;
}

const Navbar = ({ onMenuToggle, isMenuOpen }: NavbarProps = {}) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  // Identity fallback: show a placeholder ("Admin") when the username is
  // missing so the identity area never renders empty/broken (Requirement 4.6).
  const adminName = resolveAdminName({ username: userInfo?.data?.username });

  // Controlled/uncontrolled Menu_Toggle: explicit props always take precedence
  // so the Shell can own the drawer state without coupling the Navbar to the
  // sibling Sidebar. When props are omitted, fall back to local state so the
  // toggle still functions on its own (Requirements 4.4, 9.3).
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = isMenuOpen ?? localOpen;
  const handleToggle = onMenuToggle ?? (() => setLocalOpen((open) => !open));

  return (
    <div className="navbar">
      <div className="left">
        {/* Menu_Toggle — visible only on Mobile_Viewport via SCSS.
            aria-label reflects the open/close action (Requirements 4.4, 9.3). */}
        <button
          type="button"
          className="menuToggle"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? <HiXMark aria-hidden="true" /> : <HiBars3 aria-hidden="true" />}
        </button>

        {/* Brand/logo linking to /home (Requirement 4.1). */}
        <Link to="/home" className="logo">
          <img
            src="https://www.mylottohub.com/megzy/images/logo.png"
            alt="MyLottoHub Admin"
            height="40"
          />
        </Link>
      </div>

      <div className="icons">
        {/* Admin identity area from existing auth state (Requirements 4.2, 4.6). */}
        <div className="user">
          <span className="greeting">
            Welcome <strong>{adminName}</strong>
          </span>
          {/* Existing Theme Switch (Requirement 4.3). */}
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
