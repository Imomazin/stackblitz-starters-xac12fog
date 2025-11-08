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

// API request/response types for AI plan generation
export type AIPlanRequest = {
  scenarioTitle: string;
  scenarioDescription?: string;
  variables: ScenarioVariable[];
  timeHorizonDays: number;
  simulationSummary?: string;
};

export type AIPlanResponse = {
  summary: string;
  actions: string[];
  timeline: string;
  confidence?: number;
  _source: "ai" | "local";
  _model?: string;
  _requestId?: string;
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

// Tab names (Enterprise Platform - 25+ tabs)
export type TabName =
  | "dashboard"
  | "monte-carlo"
  | "scenario-studio"
  | "register"
  | "cognitive-twin"
  | "portfolio"
  | "bow-tie"
  | "fmea"
  | "network"
  | "bayesian"
  | "kri"
  | "risk-appetite"
  | "forecasting"
  | "cyber-risk"
  | "climate-risk"
  | "supply-chain"
  | "esg"
  | "third-party"
  | "risk-transfer"
  | "agent-based"
  | "system-dynamics"
  | "stress-lab"
  | "playbooks"
  | "templates"
  | "history"
  | "reports"
  | "settings"
  | "compliance"
  | "what-if";

// Keyboard shortcuts
export type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: string;
  handler: () => void;
};

// ============================================================================
// COGNITIVE DIGITAL TWIN
// ============================================================================

export type DigitalTwin = {
  id: string;
  name: string;
  description: string;
  type: "system" | "process" | "asset" | "organization";
  linkedScenarioId?: string;
  state: TwinState;
  sensors: TwinSensor[];
  actuators: TwinActuator[];
  kpis: TwinKPI[];
  aiModel?: {
    type: "lstm" | "transformer" | "graph-neural" | "hybrid";
    trainedAt?: number;
    accuracy?: number;
  };
  simulationMode: "historical" | "predictive" | "prescriptive";
  updateFrequency: number; // milliseconds
  createdAt: number;
  updatedAt: number;
};

export type TwinState = {
  timestamp: number;
  parameters: Record<string, number>;
  health: "healthy" | "warning" | "critical" | "unknown";
  anomalyScore: number; // 0-1
  predictions: {
    horizon: number; // days ahead
    values: Record<string, number[]>;
    confidence: number[];
  };
};

export type TwinSensor = {
  id: string;
  name: string;
  type: "temperature" | "pressure" | "flow" | "speed" | "count" | "financial" | "custom";
  unit: string;
  value: number;
  threshold?: { min: number; max: number };
  status: "normal" | "warning" | "critical";
};

export type TwinActuator = {
  id: string;
  name: string;
  type: "valve" | "switch" | "controller" | "policy" | "custom";
  state: "on" | "off" | "auto";
  value: number;
};

export type TwinKPI = {
  id: string;
  name: string;
  current: number;
  target: number;
  tolerance: number;
  trend: "up" | "down" | "stable";
};

// ============================================================================
// PORTFOLIO RISK AGGREGATION
// ============================================================================

export type Portfolio = {
  id: string;
  name: string;
  description?: string;
  scenarioIds: string[];
  weights?: number[]; // portfolio composition
  aggregationMethod: "sum" | "weighted" | "copula" | "monte-carlo";
  diversificationBenefit?: number; // 0-1
  var95: number; // Value at Risk 95%
  var99: number;
  cvar95: number; // Conditional VaR
  cvar99: number;
  expectedLoss: number;
  correlationMatrix?: number[][];
  createdAt: number;
  updatedAt: number;
};

export type PortfolioMetrics = {
  totalExposure: number;
  diversifiedExposure: number;
  concentration: number; // Herfindahl index
  tailRisk: number; // P99/P50 ratio
  worstCase: number; // P99.9
  contributionToRisk: { scenarioId: string; contribution: number }[];
};

// ============================================================================
// BOW-TIE ANALYSIS
// ============================================================================

export type BowTie = {
  id: string;
  title: string;
  centralEvent: string;
  severity: 1 | 2 | 3 | 4 | 5;
  threats: BowTieNode[];
  consequences: BowTieNode[];
  preventiveControls: BowTieBarrier[];
  mitigativeControls: BowTieBarrier[];
  createdAt: number;
  updatedAt: number;
};

export type BowTieNode = {
  id: string;
  label: string;
  probability?: number; // 0-1
  linkedRiskId?: string;
};

export type BowTieBarrier = {
  id: string;
  label: string;
  effectiveness: number; // 0-1
  type: "preventive" | "detective" | "corrective";
  status: "active" | "degraded" | "failed";
  linkedThreatsOrConsequences: string[];
};

// ============================================================================
// FMEA (Failure Mode Effects Analysis)
// ============================================================================

export type FMEA = {
  id: string;
  title: string;
  type: "process" | "design" | "system";
  items: FMEAItem[];
  createdAt: number;
  updatedAt: number;
};

export type FMEAItem = {
  id: string;
  component: string;
  function: string;
  failureMode: string;
  effects: string;
  causes: string;
  severity: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  occurrence: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  detection: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  rpn: number; // Risk Priority Number = S × O × D
  actions?: string;
  responsibility?: string;
  targetDate?: string;
  actionTaken?: string;
  revisedRPN?: number;
};

// ============================================================================
// NETWORK / GRAPH ANALYSIS
// ============================================================================

export type RiskNetwork = {
  id: string;
  name: string;
  nodes: RiskNode[];
  edges: RiskEdge[];
  metrics: NetworkMetrics;
  createdAt: number;
  updatedAt: number;
};

export type RiskNode = {
  id: string;
  label: string;
  type: "risk" | "control" | "asset" | "process";
  value: number; // exposure or importance
  centrality?: number; // network centrality score
  criticality?: number; // impact if removed
};

export type RiskEdge = {
  id: string;
  source: string;
  target: string;
  weight: number; // correlation or dependency strength
  type: "causal" | "correlation" | "dependency" | "escalation";
};

export type NetworkMetrics = {
  density: number;
  clustering: number;
  avgPathLength: number;
  centralNodes: string[]; // top 5 by betweenness centrality
  criticalPaths: string[][]; // most important dependency chains
  isolatedRisks: string[];
};

// ============================================================================
// BAYESIAN NETWORK
// ============================================================================

export type BayesianNetwork = {
  id: string;
  name: string;
  nodes: BayesNode[];
  edges: { parent: string; child: string }[];
  evidence?: Record<string, boolean>; // observed states
  inference?: Record<string, number>; // posterior probabilities
  createdAt: number;
  updatedAt: number;
};

export type BayesNode = {
  id: string;
  name: string;
  states: string[]; // e.g., ["true", "false"] or ["low", "medium", "high"]
  parents: string[];
  cpt: number[]; // Conditional Probability Table (flattened)
  marginal?: number[]; // computed marginal probabilities
};

// ============================================================================
// KEY RISK INDICATORS (KRI)
// ============================================================================

export type KRI = {
  id: string;
  name: string;
  description: string;
  category: "financial" | "operational" | "compliance" | "strategic" | "cyber" | "esg";
  unit: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
  currentValue: number;
  previousValue?: number;
  trend: "improving" | "stable" | "deteriorating";
  thresholds: {
    green: { min: number; max: number };
    amber: { min: number; max: number };
    red: { min: number; max: number };
  };
  status: "green" | "amber" | "red";
  dataSource?: string;
  owner: string;
  linkedRiskIds: string[];
  history: { timestamp: number; value: number }[];
  createdAt: number;
  updatedAt: number;
};

// ============================================================================
// RISK APPETITE FRAMEWORK
// ============================================================================

export type RiskAppetite = {
  id: string;
  category: string;
  metric: string;
  unit: string;
  appetite: number; // desired level
  tolerance: number; // maximum acceptable
  capacity: number; // absolute limit
  currentExposure: number;
  status: "within-appetite" | "within-tolerance" | "exceeds-tolerance" | "near-capacity";
  owner: string;
  reviewFrequency: "monthly" | "quarterly" | "annually";
  lastReviewed: number;
  nextReview: number;
};

// ============================================================================
// TIME-SERIES FORECASTING
// ============================================================================

export type Forecast = {
  id: string;
  name: string;
  variable: string;
  historicalData: { timestamp: number; value: number }[];
  model: "arima" | "prophet" | "exponential-smoothing" | "lstm";
  horizon: number; // periods ahead
  predictions: { timestamp: number; value: number; lower: number; upper: number }[];
  accuracy?: {
    mae: number; // Mean Absolute Error
    rmse: number; // Root Mean Squared Error
    mape: number; // Mean Absolute Percentage Error
  };
  seasonality?: "none" | "daily" | "weekly" | "monthly" | "yearly";
  createdAt: number;
};

// ============================================================================
// CYBER RISK (FAIR Framework)
// ============================================================================

export type CyberRisk = {
  id: string;
  asset: string;
  threatType: "malware" | "phishing" | "ddos" | "insider" | "ransomware" | "data-breach" | "supply-chain";
  threatEventFrequency: { min: number; mode: number; max: number }; // events/year
  vulnerabilityProbability: number; // 0-1
  lossEventFrequency: { p10: number; p50: number; p90: number };
  lossMagnitude: {
    primary: { min: number; mode: number; max: number }; // financial impact
    secondary?: { reputational: number; regulatory: number };
  };
  annualLossExposure: { mean: number; p95: number };
  controls: { name: string; effectiveness: number }[];
  residualRisk: number;
  createdAt: number;
  updatedAt: number;
};

// ============================================================================
// CLIMATE RISK (TCFD-aligned)
// ============================================================================

export type ClimateRisk = {
  id: string;
  type: "physical" | "transition";
  subType: string; // e.g., "flooding", "carbon-tax", "policy-change"
  scenario: "rcp2.6" | "rcp4.5" | "rcp8.5" | "custom"; // IPCC scenarios
  timeHorizon: 2030 | 2050 | 2100;
  affectedAssets: string[];
  physicalImpact?: {
    hazard: "flood" | "drought" | "storm" | "heat" | "sea-level";
    probability: number;
    exposure: number; // asset value at risk
    vulnerability: number; // 0-1
  };
  transitionImpact?: {
    driver: "policy" | "technology" | "market" | "reputation";
    cost: number;
    revenue: number;
  };
  financialImpact: { best: number; expected: number; worst: number };
  adaptationPlan?: string;
  createdAt: number;
  updatedAt: number;
};

// ============================================================================
// SUPPLY CHAIN NETWORK
// ============================================================================

export type SupplyChainNetwork = {
  id: string;
  name: string;
  nodes: SupplyChainNode[];
  edges: SupplyChainEdge[];
  disruptions: Disruption[];
  resilience: {
    redundancy: number; // 0-1
    robustness: number;
    recoverability: number;
    overall: number;
  };
  createdAt: number;
  updatedAt: number;
};

export type SupplyChainNode = {
  id: string;
  name: string;
  type: "supplier" | "manufacturer" | "warehouse" | "distributor" | "customer";
  tier: number;
  location: { country: string; lat?: number; lon?: number };
  capacity: number;
  leadTime: number; // days
  riskScore: number; // 0-100
  criticalityScore: number;
};

export type SupplyChainEdge = {
  id: string;
  from: string;
  to: string;
  material: string;
  volume: number;
  cost: number;
  reliability: number; // 0-1
};

export type Disruption = {
  id: string;
  nodeId: string;
  type: "supplier-failure" | "logistics" | "demand-shock" | "natural-disaster" | "geopolitical";
  probability: number;
  impact: number;
  duration: number; // days
  rippleEffect: { nodeId: string; delay: number; magnitude: number }[];
};

// ============================================================================
// ESG METRICS
// ============================================================================

export type ESGMetrics = {
  id: string;
  period: string; // e.g., "2024-Q1"
  environmental: {
    carbonEmissions: number; // tonnes CO2e
    energyConsumption: number; // MWh
    waterUsage: number; // cubic meters
    wasteGenerated: number; // tonnes
    renewableEnergy: number; // percentage
  };
  social: {
    employeeTurnover: number; // percentage
    genderDiversity: number; // percentage female
    trainingHours: number;
    safetyIncidents: number;
    communityInvestment: number; // currency
  };
  governance: {
    boardIndependence: number; // percentage
    ethicsTraining: number; // percentage completed
    auditFindings: number;
    dataBreaches: number;
    complianceScore: number; // 0-100
  };
  overallScore: number; // 0-100
  benchmarkPercentile?: number;
  trends: { metric: string; direction: "up" | "down" | "stable" }[];
  createdAt: number;
};

// ============================================================================
// THIRD-PARTY / VENDOR RISK
// ============================================================================

export type ThirdPartyRisk = {
  id: string;
  vendorName: string;
  category: "supplier" | "service-provider" | "technology" | "outsourcer";
  criticality: "low" | "medium" | "high" | "critical";
  contract: {
    startDate: string;
    endDate: string;
    value: number;
  };
  assessment: {
    date: number;
    financial: number; // score 0-100
    operational: number;
    cyber: number;
    compliance: number;
    reputational: number;
    overall: number;
  };
  issues: { severity: "low" | "medium" | "high"; description: string; status: "open" | "closed" }[];
  sla: { metric: string; target: number; actual: number }[];
  contingencyPlan?: string;
  lastAudit?: number;
  nextAudit?: number;
  status: "active" | "under-review" | "terminated";
  createdAt: number;
  updatedAt: number;
};

// ============================================================================
// RISK TRANSFER / INSURANCE OPTIMIZATION
// ============================================================================

export type InsurancePolicy = {
  id: string;
  type: "property" | "liability" | "cyber" | "business-interruption" | "directors-officers" | "professional-indemnity";
  carrier: string;
  premium: number; // annual
  deductible: number;
  limit: number;
  coverage: string[];
  policyPeriod: { start: string; end: string };
  claims: { date: string; amount: number; status: "open" | "settled" }[];
  utilizationRate: number; // claims/premium ratio
  optimizationScore?: number; // efficiency of coverage
};

export type RiskTransferAnalysis = {
  id: string;
  totalExposure: number;
  insuredExposure: number;
  retainedExposure: number;
  transferEfficiency: number; // cost vs benefit
  coverageGaps: { risk: string; exposure: number }[];
  optimizationRecommendations: string[];
  costBenefitRatio: number;
  createdAt: number;
};

// ============================================================================
// AGENT-BASED MODEL
// ============================================================================

export type AgentBasedModel = {
  id: string;
  name: string;
  description: string;
  agents: AgentDefinition[];
  environment: {
    width: number;
    height: number;
    topology: "grid" | "network" | "continuous";
  };
  rules: InteractionRule[];
  steps: number;
  currentStep: number;
  state?: AgentState[];
  metrics: { step: number; values: Record<string, number> }[];
  createdAt: number;
};

export type AgentDefinition = {
  type: string;
  count: number;
  attributes: Record<string, number | string>;
  behavior: string; // JS code or rule reference
};

export type InteractionRule = {
  id: string;
  condition: string;
  action: string;
  priority: number;
};

export type AgentState = {
  id: string;
  type: string;
  position: { x: number; y: number };
  attributes: Record<string, number | string>;
  connections: string[];
};

// ============================================================================
// SYSTEM DYNAMICS
// ============================================================================

export type SystemDynamicsModel = {
  id: string;
  name: string;
  description: string;
  stocks: Stock[];
  flows: Flow[];
  auxiliaries: Auxiliary[];
  connections: { from: string; to: string; polarity: "+" | "-" }[];
  timeUnit: "day" | "week" | "month" | "year";
  timeHorizon: number;
  dt: number; // time step
  results?: { time: number; values: Record<string, number> }[];
  createdAt: number;
  updatedAt: number;
};

export type Stock = {
  id: string;
  name: string;
  initial: number;
  unit: string;
};

export type Flow = {
  id: string;
  name: string;
  from?: string; // stock id (undefined for source)
  to?: string; // stock id (undefined for sink)
  equation: string;
};

export type Auxiliary = {
  id: string;
  name: string;
  equation: string;
  unit?: string;
};

// ============================================================================
// COMPLIANCE & REGULATORY
// ============================================================================

export type ComplianceFramework = {
  id: string;
  name: string; // e.g., "SOX", "GDPR", "ISO 27001", "Basel III"
  type: "financial" | "data-privacy" | "security" | "industry-specific" | "quality";
  requirements: ComplianceRequirement[];
  overallCompliance: number; // 0-100
  lastAssessment: number;
  nextAssessment: number;
  status: "compliant" | "partial" | "non-compliant";
  createdAt: number;
  updatedAt: number;
};

export type ComplianceRequirement = {
  id: string;
  reference: string; // e.g., "GDPR Art. 32"
  description: string;
  controls: string[]; // linked control IDs
  evidence: { type: string; url: string; date: number }[];
  status: "met" | "partial" | "not-met" | "not-applicable";
  gap?: string;
  remediation?: string;
  owner: string;
  dueDate?: string;
};
