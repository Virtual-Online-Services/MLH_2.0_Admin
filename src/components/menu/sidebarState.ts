/**
 * Sidebar presentation-logic core.
 *
 * Pure, side-effect-free helpers for the mobile drawer state machine and
 * active-route matching. These functions carry the universal correctness
 * properties described in the design document (Properties 2 and 3) and are
 * kept free of React/DOM concerns so they can be unit- and property-tested
 * in isolation.
 *
 * Requirements: 3.3, 3.4, 3.5, 3.7
 */

/** The mobile drawer state: `hidden` by default, `open` when toggled on. */
export type SidebarState = "hidden" | "open";

/** Events that drive the mobile drawer state machine. */
export type SidebarEvent = "toggle" | "navigate";

/**
 * Compute the next drawer state from the current state and an event.
 *
 * - `toggle` inverts the state (`hidden` <-> `open`) so the Menu_Toggle opens
 *   a closed drawer and closes an open one (Requirements 3.3, 3.4).
 * - `navigate` always yields `hidden` so selecting a Nav_Item closes the
 *   drawer after navigation (Requirement 3.5).
 */
export function nextDrawerState(
  current: SidebarState,
  event: SidebarEvent
): SidebarState {
  switch (event) {
    case "toggle":
      return current === "open" ? "hidden" : "open";
    case "navigate":
      return "hidden";
  }
}

/**
 * Determine whether a Nav_Item is the Active_Item for the current route.
 *
 * Returns `true` if and only if the item's path matches the current route
 * path exactly (Requirement 3.7).
 */
export function isActive(itemPath: string, currentPath: string): boolean {
  return itemPath === currentPath;
}
