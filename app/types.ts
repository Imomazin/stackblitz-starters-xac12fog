// app/types.ts - Comprehensive TypeScript contracts for RiskCoachNeo

export type DistName = "triangular" | "pert" | "normal" | "lognormal";
export type CorrelationModel = "pearson" | "spearman" | "none";

export type ScenarioVariable = {
  id: string;
  name: string;
  unit?: string;
  dist: DistName;
  min?: number;
  mode?: number; // for triangular/PERT
  max?: number;
  mean?: number; // for normal/lognormal
  stdev?: number;
};

export type ScenarioConfig = {
  id: string;
  title: string;
  horizonDays: number;
  runs: number; // 1k–200k
  seed?: number; // RNG seed
  correlation: CorrelationModel;
  corrMatrix?: number[][]; // optional NxN, -1..+1
  variables: ScenarioVariable[];
  kpi: "days_out_of_stock" | "cost_overrun" | "delivery_delay" | "service_level";
  createdAt: number;
  updatedAt: number;
};

export type RunSummary = {
  id: string;
  scenarioId: string;
  startedAt: number;
  completedAt: number;
  durationMs: number;
  runs: number;
  seed: number;
  kpi: ScenarioConfig["kpi"];
  mean: number;
  stdev: number;
  skewness: number;
  cv: number;
  p5: number;
  p10: number;
  p50: number;
  p90: number;
  p95: number;
};

export type SimulationOutputs = {
  summary: RunSummary;
  histogram: { bin: number; count: number }[];
  tornado: { variable: string; sensitivity: number }[];
  lec: { x: number; y: number }[]; // Loss exceedance curve
  samples?: Float32Array; // optional compact storage
};

export type RiskItem = {
  id: string;
  title: string;
  category: "Supply" | "Ops" | "Finance" | "Regulatory" | "People" | "Security" | "Other";
  description?: string;
  owner?: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigation?: string;
  residualLikelihood?: 1 | 2 | 3 | 4 | 5;
  residualImpact?: 1 | 2 | 3 | 4 | 5;
  status: "open" | "mitigating" | "closed";
  dueDate?: string;
  linkedScenarioIds?: string[];
  createdAt: number;
  updatedAt: number;
};

export type AiPlan = {
  id: string;
  scenarioId?: string;
  score: number; // confidence 0..1
  sections: { title: string; bullets: string[] }[];
  actions: { title: string; owner?: string; due?: string }[];
  narrative: string;
  createdAt: number;
  provider: "openrouter" | "local";
};

export type StressScenario = {
  id: string;
  title: string;
  baseScenarioId: string;
  shocks: { variableId: string; multiplier: number }[];
  regimeSwitch?: {
    name: string;
    corrMatrix: number[][];
  };
  createdAt: number;
};

export type AppSettings = {
  theme: "dark" | "light";
  maxRuns: number; // default 50k, max 200k
  rngType: "mulberry32" | "xorshift128";
  defaultSeed: number;
  correlationMode: CorrelationModel;
  streamingChunkSize: number;
  retainSamples: boolean;
  telemetryEnabled: boolean;
};

export type ComparisonSet = {
  id: string;
  title: string;
  runIds: string[];
  createdAt: number;
};

// Worker messages
export type WorkerRequest = {
  type: "run";
  payload: {
    scenario: ScenarioConfig;
    chunkSize: number;
  };
};

export type WorkerResponse =
  | {
      type: "progress";
      payload: {
        completed: number;
        total: number;
        eta: number; // milliseconds
        partial?: Partial<SimulationOutputs>;
      };
    }
  | {
      type: "complete";
      payload: SimulationOutputs;
    }
  | {
      type: "error";
      payload: {
        message: string;
        stack?: string;
      };
    };

// Template structure
export type Template = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "supply" | "finance" | "ops" | "regulatory" | "security" | "people" | "other";
  scenario: Omit<ScenarioConfig, "id" | "createdAt" | "updatedAt">;
  riskSeeds?: Partial<RiskItem>[];
};

// Export formats
export type ExportFormat = "pdf" | "csv" | "json" | "png";

// Tab names
export type TabName =
  | "dashboard"
  | "monte-carlo"
  | "scenario-studio"
  | "register"
  | "stress-lab"
  | "playbooks"
  | "templates"
  | "history"
  | "reports"
  | "settings";

// Keyboard shortcuts
export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: string;
  handler: () => void;
};
