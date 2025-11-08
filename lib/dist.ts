// lib/dist.ts - Distribution samplers for Monte Carlo

import type { IRNG } from "./rng";
import type { ScenarioVariable } from "@/app/types";

// ============================================================================
// Triangular Distribution
// ============================================================================
export function sampleTriangular(min: number, mode: number, max: number, rng: IRNG): number {
  const u = rng.next();
  const fc = (mode - min) / (max - min);

  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
}

// ============================================================================
// PERT Distribution (Beta-based)
// ============================================================================
export function samplePERT(
  min: number,
  mode: number,
  max: number,
  lambda: number = 4,
  rng: IRNG
): number {
  const mean = (min + lambda * mode + max) / (lambda + 2);
  const range = max - min;

  if (range === 0) return min;

  // Beta distribution parameters
  const alpha = ((mean - min) * (2 * mode - min - max)) / ((mode - mean) * range);
  const beta = (alpha * (max - mean)) / (mean - min);

  // Sample from Beta using gamma variates
  const x = gammaVariate(Math.max(alpha, 0.1), 1, rng);
  const y = gammaVariate(Math.max(beta, 0.1), 1, rng);

  return min + range * (x / (x + y));
}

// Helper: Gamma distribution via Marsaglia-Tsang
function gammaVariate(alpha: number, beta: number, rng: IRNG): number {
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
      return (d * v) / beta;
    }

    if (Math.log(u) < 0.5 * x + d * (1 - v + Math.log(v))) {
      return (d * v) / beta;
    }
  }
}

// ============================================================================
// Normal Distribution
// ============================================================================
export function sampleNormal(mean: number, stdev: number, rng: IRNG): number {
  return rng.nextNormal(mean, stdev);
}

// ============================================================================
// Lognormal Distribution
// ============================================================================
export function sampleLognormal(meanLog: number, stdevLog: number, rng: IRNG): number {
  const normalSample = rng.nextNormal(meanLog, stdevLog);
  return Math.exp(normalSample);
}

// ============================================================================
// Generic Variable Sampler
// ============================================================================
export function sampleVariable(variable: ScenarioVariable, rng: IRNG): number {
  switch (variable.dist) {
    case "triangular":
      return sampleTriangular(
        variable.min ?? 0,
        variable.mode ?? 0,
        variable.max ?? 0,
        rng
      );

    case "pert":
      return samplePERT(
        variable.min ?? 0,
        variable.mode ?? 0,
        variable.max ?? 0,
        4, // default lambda
        rng
      );

    case "normal":
      return sampleNormal(variable.mean ?? 0, variable.stdev ?? 1, rng);

    case "lognormal":
      return sampleLognormal(variable.mean ?? 0, variable.stdev ?? 1, rng);

    default:
      return 0;
  }
}
