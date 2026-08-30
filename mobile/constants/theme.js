/**
 * Forest-green clinical color tokens & API endpoint config.
 */

// Use your live deployed Render API URL
export const API_BASE_URL = "https://dermascan-ai-backend-app.onrender.com";

export const API_ENDPOINTS = {
  screen: `${API_BASE_URL}/api/v1/screen`,
  health: `${API_BASE_URL}/api/v1/health`,
  exportReport: `${API_BASE_URL}/api/v1/export-report`,
};

export const COLORS = {
  primary: "#0B3D2E", // deep forest green
  primaryLight: "#1F6E4F",
  accent: "#2E9E6B",
  background: "#F5F7F5",
  surface: "#FFFFFF",
  textPrimary: "#101A14",
  textSecondary: "#5A6B60",
  border: "#DDE5E0",

  riskHigh: "#C0392B",
  riskHighBg: "#FBEAE8",
  riskModerate: "#D68910",
  riskModerateBg: "#FDF3E3",
  riskLow: "#1F8A4C",
  riskLowBg: "#E9F7EF",

  warning: "#D68910",
  danger: "#C0392B",
};

export const RISK_TIER_STYLES = {
  High: { color: COLORS.riskHigh, background: COLORS.riskHighBg, label: "HIGH RISK" },
  Moderate: { color: COLORS.riskModerate, background: COLORS.riskModerateBg, label: "MODERATE RISK" },
  Low: { color: COLORS.riskLow, background: COLORS.riskLowBg, label: "LOW RISK" },
};

export const DISCLAIMER_TEXT =
  "This is an assistive screening tool, not a medical diagnosis. Consult a dermatologist for any concerning result.";