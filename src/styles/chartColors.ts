/**
 * Chart color palette — shared JS constants for recharts series colors.
 *
 * Feature: admin-dashboard-redesign (Requirement 6.2)
 *
 * recharts series colors (stroke/fill) are set via props in JS, so they cannot
 * read the SCSS/CSS Design_Tokens directly. To keep chart series consistent with
 * the Design_System, this module mirrors the token hex values as a small,
 * ordered palette derived from the brand + status Color_Tokens defined in
 * `src/styles/_tokens.scss`. Chart text and surfaces still use the CSS custom
 * properties via SCSS; only series colors use these constants.
 *
 * Keep these values in sync with the light-theme Color_Tokens in _tokens.scss.
 */

// Brand / primary + status Color_Tokens (light theme values from _tokens.scss).
export const CHART_COLORS = {
  brand: "#dfb017",
  success: "#15803d",
  danger: "#b91c1c",
  warning: "#b45309",
} as const;

/**
 * Ordered series palette for multi-series charts. Cycles through the token
 * colors so any number of series stays within the Design_System palette.
 */
export const CHART_SERIES: readonly string[] = [
  CHART_COLORS.brand,
  CHART_COLORS.success,
  CHART_COLORS.danger,
  CHART_COLORS.warning,
];

/** Returns a series color by index, cycling through the palette. */
export function seriesColor(index: number): string {
  return CHART_SERIES[index % CHART_SERIES.length];
}
