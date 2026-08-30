/**
 * Persisted scan history using AsyncStorage.
 *
 * Each entry stores just enough to render a history list and re-open
 * a past result: the original photo URI, prediction summary, and a
 * timestamp. The full heatmap is also cached so past results can be
 * re-viewed without hitting the backend again.
 *
 * NOTE: image URIs from expo-camera / expo-image-picker point to the
 * app's cache directory, which the OS may clear over time — this is
 * fine for a hackathon demo, but a production build would want to
 * copy captures into a persistent document directory instead.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dermascan_history_v1";
const MAX_HISTORY_ITEMS = 30;

export function useScanHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch (err) {
      console.warn("Failed to load scan history", err);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addEntry = useCallback(async (entry) => {
    const newEntry = {
      id: `${Date.now()}`,
      timestamp: Date.now(),
      ...entry,
    };
    setHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ITEMS);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.warn("Failed to save scan history", err)
      );
      return updated;
    });
    return newEntry;
  }, []);

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeEntry = useCallback(async (id) => {
    setHistory((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch((err) =>
        console.warn("Failed to update scan history", err)
      );
      return updated;
    });
  }, []);

  return { history, isLoading, addEntry, clearHistory, removeEntry, reload: load };
}