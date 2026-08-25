/**
 * Wraps the /screen API call with loading/error/result state so
 * screens don't need to manage fetch lifecycle themselves.
 */

import { useCallback, useState } from "react";
import { screenLesion } from "../services/api";

export function useScreening() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const runScreening = useCallback(async (imageUri) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await screenLesion(imageUri);
      setResult(response);
      return response;
    } catch (err) {
      setError(err.message || "Something went wrong during screening.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { isLoading, error, result, runScreening, reset };
}
