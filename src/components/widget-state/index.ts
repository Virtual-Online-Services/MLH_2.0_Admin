/**
 * Widget state UI — shared presentation components for rendering a Widget's
 * loading / empty / error states vs. its content, plus a lightweight error
 * boundary fallback.
 *
 * Feature: admin-dashboard-redesign
 * Requirements: 5.4, 5.5, 5.6, 8.1, 8.2, 8.3, 8.4
 */
export { LoadingState } from "./LoadingState";
export type { LoadingStateProps } from "./LoadingState";

export { EmptyState } from "./EmptyState";
export type { EmptyStateProps } from "./EmptyState";

export { WidgetErrorBoundary } from "./WidgetErrorBoundary";
export type { WidgetErrorBoundaryProps } from "./WidgetErrorBoundary";

export { WidgetStateView } from "./WidgetStateView";
export type { WidgetStateViewProps } from "./WidgetStateView";
