// lib/monte-carlo.ts - Monte Carlo Simulation Engine

import type {
  Scenario,
  ScenarioVariable,
  SimulationResult,
  SimulationRun,
  Percentiles,
  KPIType,
} from "@/app/types";

// ============================================================================
// Random Number Generators (deterministic seed support for reproducibility)
// ============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number = Date.now()) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  // Box-Muller transform for normal distribution
  nextNormal(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

// ============================================================================
// Distribution Samplers
// ============================================================================

export function sampleTriangular(
  min: number,
  mode: number,
  max: number,
  rng: SeededRandom
): number {
  const u = rng.next();
  const fc = (mode - min) / (max - min);

  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

export function samplePERT(
  min: number,
  mode: number,
  max: number,
  lambda: number = 4,
  rng: SeededRandom
): number {
  // PERT uses a Beta distribution
  const mean = (min + lambda * mode + max) / (lambda + 2);
  const range = max - min;

  if (range === 0) return min;

  // Simplified Beta approximation using mean and mode
  const alpha = ((mean - min) * (2 * mode - min - max)) / ((mode - mean) * range);
  const beta = (alpha * (max - mean)) / (mean - min);

  // Use two gamma variates to sample from Beta
  const x = gammaVariate(alpha, 1, rng);
  const y = gammaVariate(beta, 1, rng);

  return min + range * (x / (x + y));
}

export function sampleNormal(mean: number, stdDev: number, rng: SeededRandom): number {
  return rng.nextNormal(mean, stdDev);
}

export function sampleLognormal(
  meanLog: number,
  stdDevLog: number,
  rng: SeededRandom
): number {
  const normalSample = rng.nextNormal(meanLog, stdDevLog);
  return Math.exp(normalSample);
}

// Helper: Gamma variate using Marsaglia and Tsang method
function gammaVariate(alpha: number, beta: number, rng: SeededRandom): number {
  if (alpha < 1) {
    return gammaVariate(alpha + 1, beta, rng) * Math.pow(rng.next(), 1 / alpha);
  }

  const d = alpha - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x = rng.nextNormal(0, 1);
    let v = 1 + c * x;

    if (v <= 0) continue;

    v = v * v * v;
    const u = rng.next();
    x = x * x;

    if (u < 1 - 0.0331 * x * x) {
      return d * v / beta;
    }

    if (Math.log(u) < 0.5 * x + d * (1 - v + Math.log(v))) {
      return d * v / beta;
    }
  }
}

// ============================================================================
// Variable Sampler
// ============================================================================

export function sampleVariable(variable: ScenarioVariable, rng: SeededRandom): number {
  switch (variable.distribution) {
    case "triangular":
      return sampleTriangular(
        variable.min ?? 0,
        variable.mostLikely ?? 0,
        variable.max ?? 0,
        rng
      );

    case "pert":
      return samplePERT(
        variable.min ?? 0,
        variable.mostLikely ?? 0,
        variable.max ?? 0,
        variable.lambda ?? 4,
        rng
      );

    case "normal":
      return sampleNormal(variable.mean ?? 0, variable.stdDev ?? 1, rng);

    case "lognormal":
      return sampleLognormal(variable.mean ?? 0, variable.stdDev ?? 1, rng);

    default:
      return 0;
  }
}

// ============================================================================
// KPI Calculators
// ============================================================================

export function calculateKPI(
  kpiType: KPIType,
  values: Record<string, number>,
  scenario: Scenario
): number {
  // These are example KPI calculations - adjust based on your variables
  switch (kpiType) {
    case "days_out_of_stock":
      // Example: delay_days - stock_days
      return (values["delay"] || 0) - (values["stock_coverage"] || 0);

    case "cost_overrun":
      // Example: actual_cost - budgeted_cost
      return (values["actual_cost"] || 0) - (values["budgeted_cost"] || 0);

    case "delivery_delay":
      // Example: actual_delivery - planned_delivery
      return (values["delivery_time"] || 0) - (values["planned_time"] || 0);

    case "service_level":
      // Example: fulfilled_orders / total_orders
      return (values["fulfilled"] || 0) / Math.max(values["total_orders"] || 1, 1);

    default:
      // Fallback: sum of all variable values
      return Object.values(values).reduce((sum, v) => sum + v, 0);
  }
}

// ============================================================================
// Statistics Calculators
// ============================================================================

export function calculatePercentiles(values: number[]): Percentiles {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const getPercentile = (p: number) => {
    const index = (p / 100) * (n - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;

    if (upper >= n) return sorted[n - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  return {
    p5: getPercentile(5),
    p10: getPercentile(10),
    p50: getPercentile(50),
    p90: getPercentile(90),
    p95: getPercentile(95),
  };
}

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0;
  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

export function calculateSkewness(values: number[], mean: number, stdDev: number): number {
  if (values.length === 0 || stdDev === 0) return 0;
  const n = values.length;
  const m3 = values.reduce((sum, v) => sum + Math.pow((v - mean) / stdDev, 3), 0) / n;
  return m3;
}

export function createHistogram(values: number[], binCount: number = 30) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / binCount;

  const bins = Array(binCount)
    .fill(0)
    .map((_, i) => ({
      bin: min + i * binSize + binSize / 2,
      count: 0,
    }));

  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), binCount - 1);
    if (binIndex >= 0) bins[binIndex].count++;
  });

  return bins;
}

// ============================================================================
// Tornado Chart (Sensitivity Analysis)
// ============================================================================

export function calculateTornado(
  scenario: Scenario,
  baselineKPI: number,
  nSamples: number = 100
): { variable: string; sensitivity: number }[] {
  const sensitivities: { variable: string; sensitivity: number }[] = [];
  const rng = new SeededRandom(42); // Fixed seed for consistency

  scenario.variables.forEach((variable) => {
    const impacts: number[] = [];

    for (let i = 0; i < nSamples; i++) {
      const values: Record<string, number> = {};

      // Sample all variables
      scenario.variables.forEach((v) => {
        values[v.id] = sampleVariable(v, rng);
      });

      const kpi = calculateKPI(scenario.primaryKPI, values, scenario);
      impacts.push(Math.abs(kpi - baselineKPI));
    }

    const avgImpact = calculateMean(impacts);
    sensitivities.push({ variable: variable.name, sensitivity: avgImpact });
  });

  // Sort by sensitivity (highest first)
  return sensitivities.sort((a, b) => b.sensitivity - a.sensitivity);
}

// ============================================================================
// Main Monte Carlo Runner
// ============================================================================

export function runMonteCarlo(scenario: Scenario): SimulationResult {
  const startTime = performance.now();
  const rng = new SeededRandom(Date.now());

  const runs: SimulationRun[] = [];
  const kpiValues: number[] = [];

  // Run simulations
  for (let runId = 0; runId < scenario.nRuns; runId++) {
    const values: Record<string, number> = {};

    // Sample each variable
    scenario.variables.forEach((variable) => {
      let sample = sampleVariable(variable, rng);
      // Apply global volatility multiplier if needed
      if (scenario.volatility !== 1.0 && variable.stdDev) {
        sample *= scenario.volatility;
      }
      values[variable.id] = sample;
    });

    // Calculate KPI for this run
    const kpiResult = calculateKPI(scenario.primaryKPI, values, scenario);
    kpiValues.push(kpiResult);

    // Store run (only store first 1000 for memory efficiency)
    if (runId < 1000) {
      runs.push({ runId, values, kpiResult });
    }
  }

  // Calculate statistics
  const mean = calculateMean(kpiValues);
  const stdDev = calculateStdDev(kpiValues, mean);
  const cv = stdDev / Math.abs(mean);
  const skewness = calculateSkewness(kpiValues, mean, stdDev);
  const percentiles = calculatePercentiles(kpiValues);
  const histogram = createHistogram(kpiValues);
  const tornadoChart = calculateTornado(scenario, mean);

  const elapsedMs = performance.now() - startTime;

  return {
    scenarioId: scenario.id,
    runCount: scenario.nRuns,
    percentiles,
    mean,
    stdDev,
    cv,
    skewness,
    runs,
    histogram,
    tornadoChart,
    elapsedMs,
    timestamp: new Date().toISOString(),
  };
}
