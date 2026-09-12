import { type ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import Menu from "../menu/Menu";
import Footer from "../footer/Footer";
import { SidebarProvider, useSidebar } from "../menu/SidebarContext";
import "./shell.scss";

/**
 * Application Shell.
 *
 * Composes the persistent chrome rendered on every page — the Navbar, the
 * Sidebar (Menu), the content container, and the Footer — and wires them
 * together through the shared `SidebarContext` so the Navbar's Menu_Toggle and
 * the Sidebar drawer stay in sync (toggling opens/closes the mobile drawer and
 * navigating closes it).
 *
 * The layout styles (`shell.scss`) keep page content fully within the viewport
 * at sm/md/lg/xl/xxl, ensure the Sidebar never overlaps content on
 * Mobile_Viewport, and reflow across breakpoints using the existing responsive
 * mixins (Requirements 2.4, 2.5, 2.6, 10.5).
 *
 * Usage: wrap any page's content — `<Shell>...page content...</Shell>` — so the
 * page renders the redesigned chrome without composing it inline.
 */

export interface ShellProps {
  children: ReactNode;
}

/**
 * Inner shell rendered inside the SidebarProvider so it can read/drive the
 * shared drawer state. The Navbar Menu_Toggle and the Sidebar consume the same
 * `SidebarContext`, keeping the mobile drawer in sync.
 */
const ShellInner = ({ children }: ShellProps) => {
  const { state, toggle } = useSidebar();

  return (
    <div className="main shell">
      <Navbar onMenuToggle={toggle} isMenuOpen={state === "open"} />
      <div className="container__flex shell__body">
        <div className="menuContainer shell__sidebar">
          <Menu />
        </div>
        <div className="contentContainer shell__content">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

const Shell = ({ children }: ShellProps) => {
  return (
    <SidebarProvider>
      <ShellInner>{children}</ShellInner>
    </SidebarProvider>
  );
};

export default Shell;
