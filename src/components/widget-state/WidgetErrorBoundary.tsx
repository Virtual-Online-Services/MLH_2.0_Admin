/**
 * WidgetErrorBoundary — a lightweight React error boundary that wraps a
 * Widget's state content. If rendering the content itself throws (for example,
 * the Empty_State render fails), the boundary catches the error and renders a
 * basic fallback indicator instead of letting the error crash the page.
 *
 * The fallback is intentionally minimal (a short piece of text / dash) so it
 * can never itself fail to render.
 *
 * Requirements: 5.6
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import "./widgetState.scss";

export interface WidgetErrorBoundaryProps {
  children: ReactNode;
  /** Basic fallback indicator shown when children throw during render. */
  fallback?: ReactNode;
}

interface WidgetErrorBoundaryState {
  hasError: boolean;
}

export class WidgetErrorBoundary extends Component<
  WidgetErrorBoundaryProps,
  WidgetErrorBoundaryState
> {
  constructor(props: WidgetErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WidgetErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Intentionally swallow the error after switching to the fallback so a
    // single widget's render failure never crashes the surrounding page.
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { fallback } = this.props;
      if (fallback !== undefined) {
        return fallback;
      }
      // Basic, cannot-fail fallback indicator (Requirement 5.6).
      return (
        <div className="widgetState__fallback" role="status" aria-live="polite">
          —
        </div>
      );
    }

    return this.props.children;
  }
}

export default WidgetErrorBoundary;
