// lib/stats.ts - Statistical analysis functions

// ============================================================================
// Percentile Calculation
// ============================================================================
export function calculatePercentile(sorted: number[], p: number): number {
  const n = sorted.length;
  const index = (p / 100) * (n - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (upper >= n) return sorted[n - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function calculatePercentiles(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);

  return {
    p5: calculatePercentile(sorted, 5),
    p10: calculatePercentile(sorted, 10),
    p50: calculatePercentile(sorted, 50),
    p90: calculatePercentile(sorted, 90),
    p95: calculatePercentile(sorted, 95),
  };
}

// ============================================================================
// Basic Statistics
// ============================================================================
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function variance(values: number[], meanVal?: number): number {
  if (values.length === 0) return 0;
  const m = meanVal ?? mean(values);
  return values.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / values.length;
}

export function stdev(values: number[], meanVal?: number): number {
  return Math.sqrt(variance(values, meanVal));
}

export function skewness(values: number[], meanVal?: number, stdevVal?: number): number {
  if (values.length === 0) return 0;
  const m = meanVal ?? mean(values);
  const s = stdevVal ?? stdev(values, m);
  if (s === 0) return 0;

  const n = values.length;
  const m3 = values.reduce((sum, v) => sum + Math.pow((v - m) / s, 3), 0) / n;
  return m3;
}

export function cv(meanVal: number, stdevVal: number): number {
  if (meanVal === 0) return 0;
  return stdevVal / Math.abs(meanVal);
}

// ============================================================================
// Histogram (Sturges' rule for bin count)
// ============================================================================
export function createHistogram(
  values: number[],
  binCount?: number
): { bin: number; count: number }[] {
  if (values.length === 0) return [];

  const n = values.length;
  const bins = binCount ?? Math.ceil(Math.log2(n) + 1); // Sturges' rule

  const min = Math.min(...values);
  const max = Math.max(...values);
  const binSize = (max - min) / bins;

  const histogram = Array(bins)
    .fill(0)
    .map((_, i) => ({
      bin: min + i * binSize + binSize / 2,
      count: 0,
    }));

  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
    if (binIndex >= 0) histogram[binIndex].count++;
  });

  return histogram;
}

// ============================================================================
// Kernel Density Estimation (Gaussian kernel)
// ============================================================================
export function kde(
  values: number[],
  bandwidth?: number,
  points: number = 100
): { x: number; y: number }[] {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const n = values.length;

  // Silverman's rule of thumb for bandwidth
  const bw = bandwidth ?? 1.06 * stdev(values) * Math.pow(n, -1 / 5);

  const result: { x: number; y: number }[] = [];
  const step = (max - min) / (points - 1);

  for (let i = 0; i < points; i++) {
    const x = min + i * step;
    let density = 0;

    // Sum Gaussian kernels
    for (const value of values) {
      const u = (x - value) / bw;
      density += Math.exp(-0.5 * u * u) / Math.sqrt(2 * Math.PI);
    }

    result.push({ x, y: density / (n * bw) });
  }

  return result;
}

// ============================================================================
// Loss Exceedance Curve (complementary CDF)
// ============================================================================
export function createLEC(values: number[]): { x: number; y: number }[] {
  if (values.length === 0) return [];

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  return sorted.map((x, i) => ({
    x,
    y: 1 - (i + 1) / (n + 1), // Exceedance probability
  }));
}

// ============================================================================
// Covariance and Correlation
// ============================================================================
export function covariance(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const meanX = mean(x);
  const meanY = mean(y);
  const n = x.length;

  let cov = 0;
  for (let i = 0; i < n; i++) {
    cov += (x[i] - meanX) * (y[i] - meanY);
  }

  return cov / n;
}

export function correlation(x: number[], y: number[]): number {
  const cov = covariance(x, y);
  const stdX = stdev(x);
  const stdY = stdev(y);

  if (stdX === 0 || stdY === 0) return 0;
  return cov / (stdX * stdY);
}

// Spearman rank correlation
export function spearmanCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) return 0;

  const rankX = rank(x);
  const rankY = rank(y);

  return correlation(rankX, rankY);
}

function rank(values: number[]): number[] {
  const indexed = values.map((v, i) => ({ v, i }));
  indexed.sort((a, b) => a.v - b.v);

  const ranks = new Array(values.length);
  indexed.forEach((item, rank) => {
    ranks[item.i] = rank + 1;
  });

  return ranks;
}
