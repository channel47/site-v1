/**
 * Canonical 47 outlines. 48 × 24; 7-unit stems; 6-unit inter-numeral gap.
 * The 4 retains the original construction. The 7's 45° bridge replaces the
 * original point contact, with a ~7-unit perpendicular stroke for even weight.
 * Each numeral is one closed outline: no seams at fractional display sizes.
 * Web, social previews and `pnpm brand:build` all consume this geometry.
 */
export const MARK_VIEWBOX = "0 0 48 24"
export const MARK_WIDTH = 48
export const MARK_HEIGHT = 24
export const MARK_PATHS = [
  "M0 0H7V11H14V0H21V24H14V18H0Z",
  "M27 0H48V10L41 17V24H34V14L41 7H27Z",
] as const
export const MARK_PATH = MARK_PATHS.join(" ")
