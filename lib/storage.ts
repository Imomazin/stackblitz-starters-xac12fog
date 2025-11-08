// lib/storage.ts - LocalStorage persistence layer

import type {
  Scenario,
  RiskRegisterItem,
  HistoryEntry,
  AppSettings,
  TelemetryEvent,
} from "@/app/types";

const KEYS = {
  SCENARIOS: "risk-coach-scenarios",
  RISK_REGISTER: "risk-coach-register",
  HISTORY: "risk-coach-history",
  SETTINGS: "risk-coach-settings",
  TELEMETRY: "risk-coach-telemetry",
};

// ============================================================================
// Generic Storage Helpers
// ============================================================================

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

// ============================================================================
// Scenarios
// ============================================================================

export function getScenarios(): Scenario[] {
  return safeGet<Scenario[]>(KEYS.SCENARIOS, []);
}

export function saveScenario(scenario: Scenario): void {
  const scenarios = getScenarios();
  const index = scenarios.findIndex((s) => s.id === scenario.id);

  if (index >= 0) {
    scenarios[index] = scenario;
  } else {
    scenarios.push(scenario);
  }

  safeSet(KEYS.SCENARIOS, scenarios);
}

export function deleteScenario(id: string): void {
  const scenarios = getScenarios().filter((s) => s.id !== id);
  safeSet(KEYS.SCENARIOS, scenarios);
}

export function getScenario(id: string): Scenario | undefined {
  return getScenarios().find((s) => s.id === id);
}

// ============================================================================
// Risk Register
// ============================================================================

export function getRiskRegister(): RiskRegisterItem[] {
  return safeGet<RiskRegisterItem[]>(KEYS.RISK_REGISTER, []);
}

export function saveRiskItem(item: RiskRegisterItem): void {
  const register = getRiskRegister();
  const index = register.findIndex((r) => r.id === item.id);

  if (index >= 0) {
    register[index] = item;
  } else {
    register.push(item);
  }

  safeSet(KEYS.RISK_REGISTER, register);
}

export function deleteRiskItem(id: string): void {
  const register = getRiskRegister().filter((r) => r.id !== id);
  safeSet(KEYS.RISK_REGISTER, register);
}

export function bulkImportRiskItems(items: RiskRegisterItem[]): void {
  safeSet(KEYS.RISK_REGISTER, items);
}

export function exportRiskRegister(): RiskRegisterItem[] {
  return getRiskRegister();
}

// ============================================================================
// History
// ============================================================================

export function getHistory(): HistoryEntry[] {
  return safeGet<HistoryEntry[]>(KEYS.HISTORY, []);
}

export function saveHistory(entry: HistoryEntry): void {
  const history = getHistory();
  history.unshift(entry); // Add to beginning

  // Keep only last 50 entries
  const trimmed = history.slice(0, 50);
  safeSet(KEYS.HISTORY, trimmed);
}

export function deleteHistoryEntry(id: string): void {
  const history = getHistory().filter((h) => h.id !== id);
  safeSet(KEYS.HISTORY, history);
}

export function clearHistory(): void {
  safeSet(KEYS.HISTORY, []);
}

// ============================================================================
// Settings
// ============================================================================

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  telemetryEnabled: true,
  defaultNRuns: 10000,
  defaultVolatility: 1.0,
};

export function getSettings(): AppSettings {
  return safeGet<AppSettings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = getSettings();
  const updated = { ...current, ...settings };
  safeSet(KEYS.SETTINGS, updated);
}

// ============================================================================
// Telemetry
// ============================================================================

export function logTelemetry(event: string, metadata?: Record<string, unknown>): void {
  const settings = getSettings();
  if (!settings.telemetryEnabled) return;

  const telemetryEvent: TelemetryEvent = {
    event,
    metadata,
    timestamp: new Date().toISOString(),
  };

  const events = safeGet<TelemetryEvent[]>(KEYS.TELEMETRY, []);
  events.push(telemetryEvent);

  // Keep only last 200 events
  const trimmed = events.slice(-200);
  safeSet(KEYS.TELEMETRY, trimmed);
}

export function getTelemetry(): TelemetryEvent[] {
  return safeGet<TelemetryEvent[]>(KEYS.TELEMETRY, []);
}

export function clearTelemetry(): void {
  safeSet(KEYS.TELEMETRY, []);
}

// ============================================================================
// Bulk Export/Import
// ============================================================================

export function exportAllData() {
  return {
    scenarios: getScenarios(),
    riskRegister: getRiskRegister(),
    history: getHistory(),
    settings: getSettings(),
    telemetry: getTelemetry(),
    exportedAt: new Date().toISOString(),
  };
}

export function importAllData(data: ReturnType<typeof exportAllData>): void {
  if (data.scenarios) safeSet(KEYS.SCENARIOS, data.scenarios);
  if (data.riskRegister) safeSet(KEYS.RISK_REGISTER, data.riskRegister);
  if (data.history) safeSet(KEYS.HISTORY, data.history);
  if (data.settings) safeSet(KEYS.SETTINGS, data.settings);
  if (data.telemetry) safeSet(KEYS.TELEMETRY, data.telemetry);
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  Object.values(KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
