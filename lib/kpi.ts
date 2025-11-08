// lib/kpi.ts - KPI calculation helpers

import type { ScenarioConfig } from "@/app/types";

export type KPICalculator = (
  values: Record<string, number>,
  scenario: ScenarioConfig
) => number;

// ============================================================================
// Days Out of Stock
// ============================================================================
export function calculateDaysOutOfStock(
  values: Record<string, number>,
  scenario: ScenarioConfig
): number {
  // Example: delay - stock_coverage
  // Adjust variable names based on your scenario
  const delay = values["delay"] ?? values[Object.keys(values)[0]] ?? 0;
  const stockCoverage = values["stock"] ?? values[Object.keys(values)[1]] ?? 0;

  return Math.max(0, delay - stockCoverage);
}

// ============================================================================
// Cost Overrun
// ============================================================================
export function calculateCostOverrun(
  values: Record<string, number>,
  scenario: ScenarioConfig
): number {
  // Sum all cost variables, or compute actual - budget
  return Object.values(values).reduce((sum, v) => sum + v, 0);
}

// ============================================================================
// Delivery Delay
// ============================================================================
export function calculateDeliveryDelay(
  values: Record<string, number>,
  scenario: ScenarioConfig
): number {
  // Example: actual_delivery - planned_delivery
  const actual = values["actual"] ?? values[Object.keys(values)[0]] ?? 0;
  const planned = values["planned"] ?? values[Object.keys(values)[1]] ?? 0;

  return Math.max(0, actual - planned);
}

// ============================================================================
// Service Level (probability of meeting target)
// ============================================================================
export function calculateServiceLevel(
  values: Record<string, number>,
  scenario: ScenarioConfig
): number {
  // Example: fulfilled / total
  const fulfilled = values["fulfilled"] ?? 0;
  const total = values["total"] ?? 1;

  return fulfilled / Math.max(total, 1);
}

// ============================================================================
// Generic KPI Dispatcher
// ============================================================================
export function calculateKPI(
  kpi: ScenarioConfig["kpi"],
  values: Record<string, number>,
  scenario: ScenarioConfig
): number {
  switch (kpi) {
    case "days_out_of_stock":
      return calculateDaysOutOfStock(values, scenario);
    case "cost_overrun":
      return calculateCostOverrun(values, scenario);
    case "delivery_delay":
      return calculateDeliveryDelay(values, scenario);
    case "service_level":
      return calculateServiceLevel(values, scenario);
    default:
      return 0;
  }
}
