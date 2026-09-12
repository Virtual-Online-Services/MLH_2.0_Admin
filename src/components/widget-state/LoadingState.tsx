/**
 * Loading_State — the visual indicator a Widget displays while its data is
 * being fetched.
 *
 * Pure presentation: renders a small spinner plus an accessible label. The
 * label is customizable per widget; a sensible default is provided.
 *
 * Requirements: 5.4, 8.1
 */
import "./widgetState.scss";

export interface LoadingStateProps {
  /** Accessible/visible label describing what is loading. */
  label?: string;
}

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div className="widgetState" role="status" aria-live="polite">
      <span className="widgetState__spinner" aria-hidden="true" />
      <p className="widgetState__label">{label}</p>
    </div>
  );
}

export default LoadingState;
