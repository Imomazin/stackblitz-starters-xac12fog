// lib/montecarlo.ts - Simplified Monte Carlo engine for MVP

import type { ScenarioConfig, SimulationOutputs, RunSummary } from "@/app/types";
import { createRNG } from "./rng";
import { sampleVariable } from "./dist";
import { calculateKPI } from "./kpi";
import * as stats from "./stats";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Tornado Chart (Sensitivity Analysis)
// ============================================================================
function calculateTornado(
  scenario: ScenarioConfig,
  baselineKPI: number
): { variable: string; sensitivity: number }[] {
  const sensitivities: { variable: string; sensitivity: number }[] = [];
  const rng = createRNG(scenario.seed ? "mulberry32" : "mulberry32", scenario.seed ?? 42);

  scenario.variables.forEach((variable) => {
    const impacts: number[] = [];

    // Run small sample (100) to measure sensitivity
    for (let i = 0; i < 100; i++) {
      const values: Record<string, number> = {};

      scenario.variables.forEach((v) => {
        values[v.id] = sampleVariable(v, rng);
      });

      const kpi = calculateKPI(scenario.kpi, values, scenario);
      impacts.push(Math.abs(kpi - baselineKPI));
    }

    const avgImpact = stats.mean(impacts);
    sensitivities.push({ variable: variable.name, sensitivity: avgImpact });
  });

  return sensitivities.sort((a, b) => b.sensitivity - a.sensitivity);
}

// ============================================================================
// Main Monte Carlo Runner
// ============================================================================
export function runMonteCarloSync(scenario: ScenarioConfig): SimulationOutputs {
  const startTime = performance.now();
  const runId = generateId();

  const rng = createRNG("mulberry32", scenario.seed ?? Date.now());
  const kpiValues: number[] = [];

  // Run simulations
  for (let i = 0; i < scenario.runs; i++) {
    const values: Record<string, number> = {};

    // Sample each variable
    scenario.variables.forEach((variable) => {
      values[variable.id] = sampleVariable(variable, rng);
    });

    // Calculate KPI
    const kpiResult = calculateKPI(scenario.kpi, values, scenario);
    kpiValues.push(kpiResult);
  }

  // Calculate statistics
  const meanVal = stats.mean(kpiValues);
  const stdevVal = stats.stdev(kpiValues, meanVal);
  const cvVal = stats.cv(meanVal, stdevVal);
  const skewnessVal = stats.skewness(kpiValues, meanVal, stdevVal);
  const percentiles = stats.calculatePercentiles(kpiValues);
  const histogram = stats.createHistogram(kpiValues);
  const lec = stats.createLEC(kpiValues);
  const tornado = calculateTornado(scenario, meanVal);

  const durationMs = performance.now() - startTime;

  const summary: RunSummary = {
    id: runId,
    scenarioId: scenario.id,
    startedAt: Date.now() - durationMs,
    completedAt: Date.now(),
    durationMs,
    runs: scenario.runs,
    seed: scenario.seed ?? 42,
    kpi: scenario.kpi,
    mean: meanVal,
    stdev: stdevVal,
    skewness: skewnessVal,
    cv: cvVal,
    ...percentiles,
  };

  return {
    summary,
    histogram,
    tornado,
    lec,
  };
}
