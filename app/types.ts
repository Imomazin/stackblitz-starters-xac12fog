// app/types.ts - Strict TypeScript contracts for Risk Coach Neo

export type DistName = "triangular" | "pert" | "normal" | "lognormal";

export type ScenarioVariable = {
  id: string;
  name: string;
  unit?: string;
  distribution: DistName;
  // Distribution parameters
  min?: number;
  mostLikely?: number; // mode for triangular/PERT
  max?: number;
  mean?: number; // μ for normal/lognormal
  stdDev?: number; // σ for normal/lognormal
  lambda?: number; // PERT shape param (default 4)
};

export type KPIType = "days_out_of_stock" | "cost_overrun" | "delivery_delay" | "service_level";

export type CorrelationType = "pearson" | "spearman" | "none";

export type Scenario = {
  id: string;
  title: string;
  description?: string;
  timeHorizonDays: number;
  nRuns: number; // 1000 - 50000
  volatility: number; // global σ multiplier
  correlationType: CorrelationType;
  correlationMatrix?: number[][]; // n×n matrix if needed
  variables: ScenarioVariable[];
  primaryKPI: KPIType;
  createdAt: string;
  updatedAt: string;
};

export type SimulationRun = {
  runId: number;
  values: Record<string, number>; // variable.id -> sampled value
  kpiResult: number; // computed KPI
};

export type Percentiles = {
  p5: number;
  p10: number;
  p50: number; // median
  p90: number;
  p95: number;
};

export type SimulationResult = {
  scenarioId: string;
  runCount: number;
  percentiles: Percentiles;
  mean: number;
  stdDev: number;
  cv: number; // coefficient of variation
  skewness: number;
  runs: SimulationRun[]; // store subset for inspection
  histogram: { bin: number; count: number }[];
  tornadoChart: { variable: string; sensitivity: number }[]; // sorted by impact
  elapsedMs: number;
  timestamp: string;
};

export type RiskStatus = "open" | "mitigating" | "closed";

export type RiskCategory =
  | "operational"
  | "financial"
  | "strategic"
  | "compliance"
  | "technical"
  | "reputational";

export type RiskRegisterItem = {
  id: string;
  title: string;
  category: RiskCategory;
  description: string;
  owner: string;
  likelihood: number; // 1-5
  impact: number; // 1-5
  riskScore: number; // L × I
  mitigation: string;
  residualLikelihood: number; // 1-5 after mitigation
  residualImpact: number; // 1-5 after mitigation
  residualScore: number; // RL × RI
  status: RiskStatus;
  dueDate?: string; // ISO date
  linkedScenarioIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type AIPlanRequest = {
  scenarioTitle: string;
  scenarioDescription?: string;
  variables: ScenarioVariable[];
  timeHorizonDays: number;
  simulationSummary?: string; // optional context from sim results
};

export type AIPlanResponse = {
  summary: string; // executive summary (6 bullets)
  actions: string[]; // 3 key actions
  timeline: string; // suggested timeline
  confidence?: number; // 0-1
  _source: "ai" | "local"; // whether AI or fallback
  _model?: string;
  _requestId?: string;
};

export type TemplateType =
  | "supply_chain_delay"
  | "payment_outage"
  | "regulatory_change"
  | "security_incident"
  | "vendor_bankruptcy"
  | "staff_absence"
  | "currency_shock";

export type Template = {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  icon: string; // emoji
  scenario: Omit<Scenario, "id" | "createdAt" | "updatedAt">;
  riskSeeds?: Partial<RiskRegisterItem>[]; // optional pre-populated risks
};

export type HistoryEntry = {
  id: string;
  scenarioTitle: string;
  timestamp: string;
  result: SimulationResult;
  scenario: Scenario;
};

export type TelemetryEvent = {
  event: string;
  duration?: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
};

export type AppSettings = {
  theme: "dark" | "light";
  telemetryEnabled: boolean;
  defaultNRuns: number;
  defaultVolatility: number;
  openRouterApiKey?: string; // optional
};

// Utility types
export type ExportFormat = "pdf" | "csv" | "json";

export type TabName = "simulation" | "register" | "plan" | "history";
