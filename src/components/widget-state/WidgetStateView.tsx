/**
 * WidgetStateView — the reusable UI wrapper that maps a widget's `ViewState`
 * (derived by `deriveViewState`) to what it renders:
 *
 *   - "loading" -> Loading_State indicator          (Requirements 5.4, 8.1)
 *   - "empty"   -> Empty_State message              (Requirements 5.5, 8.2)
 *   - "error"   -> Empty_State (error variant)      (Requirements 5.5, 8.4)
 *   - "content" -> the widget's own children        (Requirement 8.3)
 *
 * The loading / empty / error state content is wrapped in a
 * WidgetErrorBoundary so that if rendering the Empty_State itself throws, a
 * basic fallback indicator is shown instead of crashing the page
 * (Requirement 5.6).
 *
 * All state visuals are styled with Design_System tokens via widgetState.scss.
 *
 * Requirements: 5.4, 5.5, 5.6, 8.1, 8.2, 8.3, 8.4
 */
import type { ReactNode } from "react";
import type { ViewState } from "../../pages/home/viewState";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";
import "./widgetState.scss";

export interface WidgetStateViewProps {
  /** The derived view-state controlling what is rendered. */
  state: ViewState;
  /** Rendered only when `state === "content"`. */
  children: ReactNode;

  /** Customizable label shown in the Loading_State. */
  loadingLabel?: string;

  /** Customizable message shown in the Empty_State. */
  emptyMessage?: string;
  /** Optional hint shown beneath the empty message. */
  emptyHint?: string;

  /** Customizable message shown in the error state. */
  errorMessage?: string;
  /** Optional hint shown beneath the error message. */
  errorHint?: string;

  /** Basic fallback indicator if the state content itself throws. */
  fallback?: ReactNode;
}

export function WidgetStateView({
  state,
  children,
  loadingLabel,
  emptyMessage,
  emptyHint,
  errorMessage = "Unable to load data",
  errorHint,
  fallback,
}: WidgetStateViewProps) {
  if (state === "content") {
    return <>{children}</>;
  }

  let stateContent: ReactNode;
  if (state === "loading") {
    stateContent = <LoadingState label={loadingLabel} />;
  } else if (state === "error") {
    stateContent = (
      <EmptyState message={errorMessage} hint={errorHint} variant="error" />
    );
  } else {
    // "empty"
    stateContent = <EmptyState message={emptyMessage} hint={emptyHint} />;
  }

  return (
    <WidgetErrorBoundary fallback={fallback}>{stateContent}</WidgetErrorBoundary>
  );
}

export default WidgetStateView;
