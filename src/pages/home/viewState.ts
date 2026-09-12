/**
 * Shared widget view-state selector.
 *
 * Every data-driven Widget on the Home dashboard (Stat_Cards, Chart_Widgets,
 * Transactions_Table) derives a single `ViewState` from its existing
 * data / loading / error inputs. Rendering is then a pure function of that
 * state, which makes the "never blank/broken" guarantees deterministic and
 * testable.
 *
 * Requirements: 5.4, 5.5, 6.4, 6.5, 6.7, 7.4, 7.5, 8.1, 8.2, 8.3, 8.4
 */

export type ViewState = "loading" | "empty" | "content" | "error";

export interface WidgetInput<T> {
  isLoading: boolean;
  isError: boolean;
  data: T | null | undefined; // arrays, objects, or numbers per widget
}

/**
 * Returns true when `data` should be treated as "absent/empty":
 * null, undefined, an empty array (length 0), or an empty object
 * (zero own enumerable keys).
 *
 * Non-empty arrays/objects and primitives that are present (including the
 * number 0 and other falsy-but-present values) are considered content.
 */
function isDataEmpty(data: unknown): boolean {
  if (data === null || data === undefined) {
    return true;
  }

  if (Array.isArray(data)) {
    return data.length === 0;
  }

  // Plain objects (but not arrays, handled above) are empty when they have
  // zero own enumerable keys.
  if (typeof data === "object") {
    return Object.keys(data as Record<string, unknown>).length === 0;
  }

  // Any other present value (number including 0, string, boolean, etc.)
  // counts as content.
  return false;
}

/**
 * Derives the single view-state for a widget using strict precedence:
 *
 *   1. isLoading === true            -> "loading"  (loading always wins;
 *                                       empty is never evaluated while loading)
 *   2. else isError === true         -> "error"
 *   3. else data absent/empty        -> "empty"
 *   4. else                          -> "content"
 */
export function deriveViewState<T>(input: WidgetInput<T>): ViewState {
  if (input.isLoading) {
    return "loading";
  }

  if (input.isError) {
    return "error";
  }

  if (isDataEmpty(input.data)) {
    return "empty";
  }

  return "content";
}
