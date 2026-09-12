/**
 * Empty_State — the visual message a Widget displays when its data has loaded
 * but contains no records, or when the data request failed.
 *
 * Pure presentation: renders a message (and optional hint). The `variant`
 * distinguishes an empty result from an error so the two can be styled
 * differently while sharing the same layout.
 *
 * Requirements: 5.5, 8.2, 8.4
 */
import "./widgetState.scss";

export interface EmptyStateProps {
  /** Primary message shown to the user. */
  message?: string;
  /** Optional secondary hint line. */
  hint?: string;
  /** Visual variant: a neutral empty result or an error. */
  variant?: "empty" | "error";
}

export function EmptyState({
  message = "No data to display",
  hint,
  variant = "empty",
}: EmptyStateProps) {
  const className =
    variant === "error" ? "widgetState widgetState--error" : "widgetState";

  return (
    <div className={className} role="status" aria-live="polite">
      <p className="widgetState__message">{message}</p>
      {hint ? <p className="widgetState__hint">{hint}</p> : null}
    </div>
  );
}

export default EmptyState;
