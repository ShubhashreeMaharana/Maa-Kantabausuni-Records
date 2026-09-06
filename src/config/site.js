// constants for publisher and copyright — keep only in code (not editable via UI)
export const P_LINE = "Maa Kantabausuni Records Pvt Ltd";
export const C_LINE = "Maa Kantabausuni Records Pvt Ltd";

// Returns phonogram (P) line with current year, e.g., ℗ 2026 Maa Kantabausuni Records Pvt Ltd
export function getPLineWithYear() {
  const year = new Date().getFullYear();
  return `℗ ${year} ${P_LINE}`;
}

// Returns copyright (C) line with current year, e.g., © 2026 Maa Kantabausuni Records Pvt Ltd
export function getCLineWithYear() {
  const year = new Date().getFullYear();
  return `© ${year} ${C_LINE}`;
}
