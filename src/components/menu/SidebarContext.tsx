/**
 * Shared UI context for the mobile Sidebar drawer.
 *
 * The Navbar's Menu_Toggle (a sibling of the Sidebar) needs to control the
 * Sidebar drawer's open/close state. Rather than coupling the two sibling
 * components directly, this lightweight context lifts the drawer state to a
 * common provider that the Shell (App) mounts around both the Navbar and the
 * Sidebar.
 *
 * The state transitions are delegated to the pure `nextDrawerState` state
 * machine in `sidebarState.ts` so the drawer behavior stays consistent with
 * the design's Property 2 (Requirements 3.3, 3.4, 3.5).
 *
 * Consumers:
 *   - Navbar Menu_Toggle calls `toggle()` (Requirements 3.3, 3.4).
 *   - Sidebar reads `state` to render as an open/hidden drawer on mobile and
 *     calls `close()` after a Nav_Item is selected (Requirement 3.5).
 *   - App/Shell wraps the Navbar + Sidebar (+ content) in `<SidebarProvider>`.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { nextDrawerState, type SidebarState } from "./sidebarState";

/** Shape of the shared sidebar UI context. */
export interface SidebarContextValue {
  /** Current mobile drawer state: `"hidden"` (default) or `"open"`. */
  state: SidebarState;
  /** Toggle the drawer open/closed (used by the Navbar Menu_Toggle). */
  toggle: () => void;
  /** Force the drawer closed (used after Nav_Item navigation). */
  close: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

/**
 * Provider that owns the shared mobile drawer state. Mount this in the Shell
 * (App) so both the Navbar and the Sidebar can consume the same state.
 */
export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SidebarState>("hidden");

  const toggle = useCallback(() => {
    setState((current) => nextDrawerState(current, "toggle"));
  }, []);

  const close = useCallback(() => {
    setState((current) => nextDrawerState(current, "navigate"));
  }, []);

  const value = useMemo<SidebarContextValue>(
    () => ({ state, toggle, close }),
    [state, toggle, close]
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

/**
 * Access the shared sidebar drawer state.
 *
 * Falls back to a no-op, always-`hidden` value when used outside a
 * `SidebarProvider` so a component (e.g. the Navbar rendered in isolation in a
 * test) never crashes for lack of a provider.
 */
export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (context) {
    return context;
  }
  return {
    state: "hidden",
    toggle: () => {},
    close: () => {},
  };
}
