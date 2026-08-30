/**
 * Typed fetch layer for the DermaScan AI backend.
 *
 * Matches the actual FastAPI routes in dermascan-backend:
 *   POST /api/v1/screen          -> ScreenResponse (see app/models/schemas.py)
 *   GET  /api/v1/health          -> { status, model_loaded }
 *   POST /api/v1/export-report   -> PDF bytes
 */

import { Platform } from "react-native";
import { API_ENDPOINTS } from "../../constants/theme";

/**
 * Sends a captured/selected image to the backend for screening.
 * @param {string} imageUri - local file URI from camera or image picker
 * @returns {Promise<{
 *   predicted_class: string,
 *   risk_tier: 'Low'|'Moderate'|'High',
 *   confidence: number,
 *   class_probabilities: Record<string, number>,
 *   heatmap_base64: string,
 *   disclaimer: string
 * }>}
 */
export async function screenLesion(imageUri) {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // For web: fetch blob from image URI/dataURL and append as a true File/Blob
    const res = await fetch(imageUri);
    const blob = await res.blob();
    formData.append("image", blob, "lesion.jpg");
  } else {
    // For iOS & Android React Native runtimes
    formData.append("image", {
      uri: imageUri,
      name: "lesion.jpg",
      type: "image/jpeg",
    });
  }

  // Do NOT pass headers: { "Content-Type": "multipart/form-data" }
  // fetch automatically supplies multipart/form-data with the boundary string
  const response = await fetch(API_ENDPOINTS.screen, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Screening failed (status ${response.status})`);
  }

  return response.json();
}

/**
 * Checks backend health / model-loaded status. Useful for a startup
 * check so the app can warn the user if the server isn't reachable.
 */
export async function checkHealth() {
  const response = await fetch(API_ENDPOINTS.health);
  if (!response.ok) {
    throw new Error(`Health check failed (status ${response.status})`);
  }
  return response.json();
}

/**
 * Requests a doctor-ready PDF export for a completed screening result.
 */
export async function exportReport({ predictedClass, riskTier, confidence, heatmapBase64, patientNotes }) {
  const response = await fetch(API_ENDPOINTS.exportReport, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      predicted_class: predictedClass,
      risk_tier: riskTier,
      confidence,
      heatmap_base64: heatmapBase64,
      patient_notes: patientNotes || "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Export failed (status ${response.status})`);
  }

  // Backend returns raw PDF bytes.
  return response.blob();
}