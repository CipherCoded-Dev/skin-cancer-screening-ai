/**
 * Forest-green clinical color tokens & API endpoint config.
 *
 * IMPORTANT: Update API_BASE_URL to your machine's LAN IP when testing
 * on a physical phone — "localhost" on the phone refers to the phone
 * itself, not your laptop running the FastAPI server.
 *
 * Find your IP:
 *   Mac/Linux: ifconfig | grep "inet "
 *   Windows:   ipconfig
 * Then set it below, e.g. "http://192.168.1.42:8000"
 */

export const API_BASE_URL = "http://192.168.1.42:8000"; // <-- CHANGE THIS

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
