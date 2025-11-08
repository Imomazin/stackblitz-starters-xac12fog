"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Sparkles,
  Download,
  Moon,
  Sun,
  Play,
  Settings,
  BookTemplate,
  ListChecks,
  TrendingUp,
  Plus,
  Trash2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type {
  Scenario,
  ScenarioVariable,
  SimulationResult,
  RiskRegisterItem,
  TabName,
  AIPlanResponse,
  Template,
  DistName,
  KPIType,
} from "./types";

import { runMonteCarlo } from "@/lib/monte-carlo";
import { getAllTemplates } from "@/lib/templates";
import {
  getSettings,
  saveSettings,
  getHistory,
  saveHistory,
  getRiskRegister,
  saveRiskItem,
  deleteRiskItem,
  logTelemetry,
} from "@/lib/storage";
import { generateId, formatNumber, formatPercent, downloadFile } from "@/lib/utils";

export default function RiskCoachNeo() {
  // ========================================================================
  // State Management
  // ========================================================================

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<TabName>("simulation");

  // Scenario state
  const [scenario, setScenario] = useState<Scenario>({
    id: generateId(),
    title: "Supply Chain Risk Analysis",
    description: "Assess impact of supplier delays",
    timeHorizonDays: 30,
    nRuns: 10000,
    volatility: 1.0,
    correlationType: "none",
    primaryKPI: "days_out_of_stock",
    variables: [
      {
        id: generateId(),
        name: "Supplier Delay",
        unit: "days",
        distribution: "pert",
        min: 7,
        mostLikely: 14,
        max: 30,
        lambda: 4,
      },
      {
        id: generateId(),
        name: "Stock Coverage",
        unit: "days",
        distribution: "triangular",
        min: 8,
        mostLikely: 12,
        max: 18,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [aiPlan, setAiPlan] = useState<AIPlanResponse | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Risk Register state
  const [riskRegister, setRiskRegister] = useState<RiskRegisterItem[]>([]);
  const [templates] = useState<Template[]>(getAllTemplates());

  // ========================================================================
  // Effects
  // ========================================================================

  useEffect(() => {
    const settings = getSettings();
    setTheme(settings.theme);
    document.documentElement.classList.toggle("light", settings.theme === "light");

    // Load risk register
    setRiskRegister(getRiskRegister());

    logTelemetry("app_loaded");
  }, []);

  // ========================================================================
  // Handlers
  // ========================================================================

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    saveSettings({ theme: newTheme });
    document.documentElement.classList.toggle("light", newTheme === "light");
    logTelemetry("theme_toggled", { theme: newTheme });
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    logTelemetry("simulation_started", { nRuns: scenario.nRuns });

    // Run in next tick to allow UI to update
    setTimeout(() => {
      try {
        const result = runMonteCarlo(scenario);
        setSimResult(result);

        // Save to history
        saveHistory({
          id: generateId(),
          scenarioTitle: scenario.title,
          timestamp: new Date().toISOString(),
          result,
          scenario,
        });

        logTelemetry("simulation_completed", {
          nRuns: scenario.nRuns,
          elapsedMs: result.elapsedMs,
        });
      } catch (error) {
        console.error("Simulation error:", error);
        logTelemetry("simulation_error", { error: String(error) });
      } finally {
        setIsSimulating(false);
      }
    }, 100);
  };

  const handleGenerateAIPlan = async () => {
    setIsGeneratingPlan(true);
    logTelemetry("ai_plan_requested");

    try {
      const response = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          scenarioDescription: scenario.description,
          variables: scenario.variables,
          timeHorizonDays: scenario.timeHorizonDays,
          simulationSummary: simResult
            ? `P50: ${formatNumber(simResult.percentiles.p50)}, P90: ${formatNumber(simResult.percentiles.p90)}, Mean: ${formatNumber(simResult.mean)}`
            : undefined,
        }),
      });

      const data = await response.json();
      setAiPlan(data);
      logTelemetry("ai_plan_generated", { source: data._source });
    } catch (error) {
      console.error("AI plan error:", error);
      logTelemetry("ai_plan_error", { error: String(error) });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleLoadTemplate = (template: Template) => {
    setScenario({
      ...template.scenario,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setSimResult(null);
    setAiPlan(null);
    logTelemetry("template_loaded", { templateId: template.id });
  };

  const handleAddVariable = () => {
    setScenario((prev) => ({
      ...prev,
      variables: [
        ...prev.variables,
        {
          id: generateId(),
          name: `Variable ${prev.variables.length + 1}`,
          distribution: "triangular",
          min: 0,
          mostLikely: 50,
          max: 100,
        },
      ],
    }));
  };

  const handleDeleteVariable = (id: string) => {
    setScenario((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v.id !== id),
    }));
  };

  const handleUpdateVariable = (id: string, updates: Partial<ScenarioVariable>) => {
    setScenario((prev) => ({
      ...prev,
      variables: prev.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    }));
  };

  const handleAddRiskItem = () => {
    const newItem: RiskRegisterItem = {
      id: generateId(),
      title: "New Risk",
      category: "operational",
      description: "",
      owner: "",
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      mitigation: "",
      residualLikelihood: 2,
      residualImpact: 2,
      residualScore: 4,
      status: "open",
      linkedScenarioIds: [scenario.id],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveRiskItem(newItem);
    setRiskRegister([...riskRegister, newItem]);
  };

  const handleDeleteRiskItem = (id: string) => {
    deleteRiskItem(id);
    setRiskRegister(riskRegister.filter((r) => r.id !== id));
  };

  const handleExport = (format: "json" | "csv") => {
    if (!simResult) return;

    if (format === "json") {
      const data = JSON.stringify({ scenario, simResult, aiPlan }, null, 2);
      downloadFile(data, `risk-analysis-${Date.now()}.json`, "application/json");
    } else {
      // CSV export of simulation results
      const headers = "Run,KPI Value\n";
      const rows = simResult.runs.map((r) => `${r.runId},${r.kpiResult}`).join("\n");
      downloadFile(headers + rows, `simulation-${Date.now()}.csv`, "text/csv");
    }

    logTelemetry("export", { format });
  };

  // ========================================================================
  // Computed Values
  // ========================================================================

  const chartData = useMemo(() => {
    if (!simResult) return [];
    return simResult.histogram.map((h) => ({
      bin: formatNumber(h.bin, 1),
      count: h.count,
    }));
  }, [simResult]);

  const tornadoData = useMemo(() => {
    if (!simResult) return [];
    return simResult.tornadoChart.slice(0, 5).map((t) => ({
      variable: t.variable,
      sensitivity: t.sensitivity,
    }));
  }, [simResult]);

  // ========================================================================
  // Render
  // ========================================================================

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-drift animate-drift pointer-events-none opacity-60" />

      {/* Header */}
      <header className="relative border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-neo flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Risk Coach Neo</h1>
              <p className="text-xs text-textMute">Monte Carlo Simulation Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => handleExport("json")}
              className="btn-secondary gap-2"
              disabled={!simResult}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative max-w-[1800px] mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT PANEL: Scenario Builder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Scenario Config */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Scenario Builder
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-textMute">Title</label>
                  <input
                    type="text"
                    value={scenario.title}
                    onChange={(e) => setScenario({ ...scenario, title: e.target.value })}
                    className="input mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-textMute">Runs</label>
                    <input
                      type="number"
                      value={scenario.nRuns}
                      onChange={(e) =>
                        setScenario({ ...scenario, nRuns: Number(e.target.value) })
                      }
                      min={1000}
                      max={50000}
                      step={1000}
                      className="input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-textMute">Horizon (days)</label>
                    <input
                      type="number"
                      value={scenario.timeHorizonDays}
                      onChange={(e) =>
                        setScenario({ ...scenario, timeHorizonDays: Number(e.target.value) })
                      }
                      className="input mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-textMute">Primary KPI</label>
                  <select
                    value={scenario.primaryKPI}
                    onChange={(e) =>
                      setScenario({ ...scenario, primaryKPI: e.target.value as KPIType })
                    }
                    className="input mt-1"
                  >
                    <option value="days_out_of_stock">Days Out of Stock</option>
                    <option value="cost_overrun">Cost Overrun</option>
                    <option value="delivery_delay">Delivery Delay</option>
                    <option value="service_level">Service Level</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={handleRunSimulation} className="btn-primary flex-1 gap-2" disabled={isSimulating}>
                  {isSimulating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Simulation
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerateAIPlan}
                  className="btn-secondary gap-2"
                  disabled={isGeneratingPlan}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Variables */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Variables</h3>
                <button onClick={handleAddVariable} className="btn-ghost p-1">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {scenario.variables.map((v, idx) => (
                  <div key={v.id} className="p-3 rounded-lg border border-border bg-bg/50">
                    <div className="flex items-start justify-between mb-2">
                      <input
                        type="text"
                        value={v.name}
                        onChange={(e) => handleUpdateVariable(v.id, { name: e.target.value })}
                        className="input text-sm flex-1 mr-2"
                        placeholder="Variable name"
                      />
                      <button
                        onClick={() => handleDeleteVariable(v.id)}
                        className="btn-ghost p-1 text-danger"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select
                        value={v.distribution}
                        onChange={(e) =>
                          handleUpdateVariable(v.id, { distribution: e.target.value as DistName })
                        }
                        className="input"
                      >
                        <option value="triangular">Triangular</option>
                        <option value="pert">PERT</option>
                        <option value="normal">Normal</option>
                        <option value="lognormal">Lognormal</option>
                      </select>

                      <input
                        type="text"
                        value={v.unit || ""}
                        onChange={(e) => handleUpdateVariable(v.id, { unit: e.target.value })}
                        className="input"
                        placeholder="Unit"
                      />

                      {(v.distribution === "triangular" || v.distribution === "pert") && (
                        <>
                          <input
                            type="number"
                            value={v.min ?? 0}
                            onChange={(e) =>
                              handleUpdateVariable(v.id, { min: Number(e.target.value) })
                            }
                            className="input"
                            placeholder="Min"
                          />
                          <input
                            type="number"
                            value={v.mostLikely ?? 0}
                            onChange={(e) =>
                              handleUpdateVariable(v.id, { mostLikely: Number(e.target.value) })
                            }
                            className="input"
                            placeholder="Mode"
                          />
                          <input
                            type="number"
                            value={v.max ?? 0}
                            onChange={(e) =>
                              handleUpdateVariable(v.id, { max: Number(e.target.value) })
                            }
                            className="input"
                            placeholder="Max"
                          />
                        </>
                      )}

                      {(v.distribution === "normal" || v.distribution === "lognormal") && (
                        <>
                          <input
                            type="number"
                            value={v.mean ?? 0}
                            onChange={(e) =>
                              handleUpdateVariable(v.id, { mean: Number(e.target.value) })
                            }
                            className="input"
                            placeholder="Mean"
                          />
                          <input
                            type="number"
                            value={v.stdDev ?? 1}
                            onChange={(e) =>
                              handleUpdateVariable(v.id, { stdDev: Number(e.target.value) })
                            }
                            className="input"
                            placeholder="Std Dev"
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Templates */}
            <div className="card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <BookTemplate className="w-5 h-5" />
                Templates
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {templates.slice(0, 6).map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleLoadTemplate(tmpl)}
                    className="btn-secondary text-xs justify-start gap-2"
                  >
                    <span>{tmpl.icon}</span>
                    <span className="truncate">{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL: Results & Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Tab Navigation */}
            <div className="card py-3">
              <div className="flex gap-2">
                {(["simulation", "register", "plan"] as TabName[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`btn flex-1 ${activeTab === tab ? "btn-primary" : "btn-ghost"}`}
                  >
                    {tab === "simulation" && <BarChart3 className="w-4 h-4 mr-2" />}
                    {tab === "register" && <ListChecks className="w-4 h-4 mr-2" />}
                    {tab === "plan" && <Sparkles className="w-4 h-4 mr-2" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === "simulation" && (
                <motion.div
                  key="simulation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {/* Metrics */}
                  {simResult && (
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: "P50", value: formatNumber(simResult.percentiles.p50) },
                        { label: "P90", value: formatNumber(simResult.percentiles.p90) },
                        { label: "Mean", value: formatNumber(simResult.mean) },
                        { label: "Std Dev", value: formatNumber(simResult.stdDev) },
                      ].map((metric) => (
                        <div key={metric.label} className="card">
                          <div className="text-sm text-textMute">{metric.label}</div>
                          <div className="text-2xl font-bold mt-1">{metric.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Charts */}
                  {simResult && (
                    <>
                      <div className="card">
                        <h3 className="font-semibold mb-4">Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="bin" stroke="hsl(var(--text-mute))" fontSize={12} />
                            <YAxis stroke="hsl(var(--text-mute))" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--surface))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="card">
                        <h3 className="font-semibold mb-4">Sensitivity (Tornado Chart)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={tornadoData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis type="number" stroke="hsl(var(--text-mute))" fontSize={12} />
                            <YAxis type="category" dataKey="variable" stroke="hsl(var(--text-mute))" fontSize={12} width={120} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--surface))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="sensitivity" fill="hsl(var(--secondary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}

                  {!simResult && (
                    <div className="card h-[400px] flex items-center justify-center text-textMute">
                      Run a simulation to see results
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Risk Register</h3>
                    <button onClick={handleAddRiskItem} className="btn-primary gap-2">
                      <Plus className="w-4 h-4" />
                      Add Risk
                    </button>
                  </div>

                  <div className="space-y-3">
                    {riskRegister.length === 0 && (
                      <div className="text-center text-textMute py-8">No risks registered yet</div>
                    )}
                    {riskRegister.map((risk) => (
                      <div key={risk.id} className="p-4 rounded-lg border border-border bg-bg/30">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{risk.title}</h4>
                            <p className="text-sm text-textMute mt-1">{risk.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs text-textMute">
                              <span>L: {risk.likelihood}</span>
                              <span>I: {risk.impact}</span>
                              <span className="font-semibold text-text">Score: {risk.riskScore}</span>
                              <span className="px-2 py-0.5 rounded bg-surface border border-border">
                                {risk.status}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteRiskItem(risk.id)}
                            className="btn-ghost p-1 text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "plan" && (
                <motion.div
                  key="plan"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card"
                >
                  <h3 className="font-semibold mb-4">AI-Generated Plan</h3>

                  {!aiPlan && (
                    <div className="text-center text-textMute py-12">
                      Click the <Sparkles className="w-4 h-4 inline" /> button to generate a plan
                    </div>
                  )}

                  {aiPlan && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-textMute mb-2">Executive Summary</h4>
                        <div className="prose prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap text-sm">{aiPlan.summary}</pre>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-textMute mb-2">Key Actions</h4>
                        <ul className="space-y-2">
                          {aiPlan.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <span className="text-primary mt-1">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-textMute mb-2">Timeline</h4>
                        <p className="text-sm">{aiPlan.timeline}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-xs text-textMute">
                          Source: {aiPlan._source === "ai" ? "🤖 AI Generated" : "📦 Local Fallback"}
                        </span>
                        {aiPlan.confidence && (
                          <span className="text-xs text-textMute">
                            Confidence: {formatPercent(aiPlan.confidence)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
