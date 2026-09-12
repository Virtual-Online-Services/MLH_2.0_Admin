/**
 * Identity fallback helper for the Navbar admin identity area.
 *
 * Given the auth state (which may or may not carry a username), this returns a
 * guaranteed non-empty display name. When a real, non-blank username is present
 * it is returned trimmed; otherwise a placeholder ("Admin") is returned so the
 * identity area never renders an empty or broken value.
 *
 * Requirement 4.6: IF the admin username is unavailable in the auth state,
 * THEN the Navbar SHALL render the identity area with a placeholder.
 */

/** Placeholder used when no valid username is available. */
export const ADMIN_NAME_PLACEHOLDER = "Admin";

/**
 * Resolve the admin display name from auth state.
 *
 * @param auth - Auth object with an optional `username` (may be null/undefined).
 * @returns The trimmed username when non-blank, otherwise the placeholder.
 */
export function resolveAdminName(auth: { username?: string | null }): string {
  const name = auth?.username?.trim();
  return name ? name : ADMIN_NAME_PLACEHOLDER;
}
