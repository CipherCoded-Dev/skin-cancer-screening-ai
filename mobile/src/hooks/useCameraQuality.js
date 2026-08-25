/**
 * Lightweight client-side heuristics to nudge the user toward a usable
 * photo before it's even sent to the backend's OpenCV quality gate.
 * This is a UX nicety, not a replacement for the server-side check —
 * the server always re-validates.
 */

import { useCallback, useState } from "react";

export function useCameraQuality() {
  const [warning, setWarning] = useState(null);

  /**
   * Call with the camera's current brightness/orientation readings
   * (from expo-camera or expo-sensors) if you wire that up. For now
   * this is a simple placeholder that ScannerScreen can call before
   * capture to show a friendly warning banner.
   */
  const evaluate = useCallback(({ isSteady = true, estimatedBrightness = null } = {}) => {
    if (!isSteady) {
      setWarning("Hold steady — the camera detected motion.");
      return false;
    }
    if (estimatedBrightness !== null && estimatedBrightness < 40) {
      setWarning("Too dark — find better lighting before capturing.");
      return false;
    }
    if (estimatedBrightness !== null && estimatedBrightness > 220) {
      setWarning("Too bright / glare detected — reduce direct light.");
      return false;
    }
    setWarning(null);
    return true;
  }, []);

  const clearWarning = useCallback(() => setWarning(null), []);

  return { warning, evaluate, clearWarning };
}
