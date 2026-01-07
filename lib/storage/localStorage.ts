/**
 * LocalStorage utilities for scenario storage
 */

import type { SavedScenario } from "@/types/calculator";

const STORAGE_KEY = "taxpain_scenarios";
const MAX_SCENARIOS = 3;

/**
 * Get all saved scenarios
 */
export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const scenarios: SavedScenario[] = JSON.parse(stored);
    // Sort by timestamp (newest first)
    return scenarios.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to load scenarios:", error);
    return [];
  }
}

/**
 * Save a scenario
 */
export function saveScenario(scenario: Omit<SavedScenario, "id" | "timestamp">): boolean {
  if (typeof window === "undefined") return false;

  try {
    const scenarios = getSavedScenarios();

    // Remove oldest if at max capacity
    if (scenarios.length >= MAX_SCENARIOS) {
      scenarios.pop();
    }

    const newScenario: SavedScenario = {
      ...scenario,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    scenarios.unshift(newScenario);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    return true;
  } catch (error) {
    console.error("Failed to save scenario:", error);
    // Check if quota exceeded
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("LocalStorage quota exceeded");
    }
    return false;
  }
}

/**
 * Delete a scenario by ID
 */
export function deleteScenario(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const scenarios = getSavedScenarios().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    return true;
  } catch (error) {
    console.error("Failed to delete scenario:", error);
    return false;
  }
}

/**
 * Clear all scenarios
 */
export function clearAllScenarios(): boolean {
  if (typeof window === "undefined") return false;

  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear scenarios:", error);
    return false;
  }
}

/**
 * Check if storage is available
 */
export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

