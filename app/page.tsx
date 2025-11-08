"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Trash2, BarChart3, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useUiStore } from "./store/ui";
import { useScenarioStore } from "./store/scenario";
import { useRunsStore } from "./store/runs";
import { useRegisterStore } from "./store/register";
import { runMonteCarloSync } from "@/lib/montecarlo";
import type { ScenarioConfig, ScenarioVariable, RiskItem } from "./types";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// Dashboard Tab
// ============================================================================
function DashboardTab() {
  const runs = useRunsStore((s) => s.runs);
  const scenarios = useScenarioStore((s) => s.scenarios);
  const risks = useRegisterStore((s) => s.risks);

  const latestRun = runs[0];

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Executive Dashboard</h2>

      {/* KPI Tiles */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="text-sm text-textMute">Total Scenarios</div>
          <div className="text-3xl font-bold mt-2">{scenarios.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">Simulations Run</div>
          <div className="text-3xl font-bold mt-2">{runs.length}</div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">Open Risks</div>
          <div className="text-3xl font-bold mt-2">
            {risks.filter((r) => r.status === "open").length}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">Avg P90</div>
          <div className="text-3xl font-bold mt-2">
            {latestRun ? latestRun.summary.p90.toFixed(1) : "—"}
          </div>
        </div>
      </div>

      {/* Latest Run Summary */}
      {latestRun && (
        <div className="card">
          <h3 className="font-semibold mb-4">Latest Simulation</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={latestRun.histogram.slice(0, 20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="bin" stroke="hsl(var(--text-mute))" fontSize={10} />
                  <YAxis stroke="hsl(var(--text-mute))" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--surface))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-textMute">Mean:</span>
                <span className="font-semibold">{latestRun.summary.mean.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMute">Std Dev:</span>
                <span className="font-semibold">{latestRun.summary.stdev.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMute">P50:</span>
                <span className="font-semibold">{latestRun.summary.p50.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMute">P90:</span>
                <span className="font-semibold">{latestRun.summary.p90.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMute">Runs:</span>
                <span className="font-semibold">{latestRun.summary.runs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textMute">Duration:</span>
                <span className="font-semibold">{latestRun.summary.durationMs.toFixed(0)}ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!latestRun && (
        <div className="card h-64 flex items-center justify-center text-textMute">
          No simulations run yet. Go to Monte Carlo to run your first simulation.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Monte Carlo Tab
// ============================================================================
function MonteCarloTab() {
  const activeScenario = useScenarioStore((s) => s.getActiveScenario());
  const addRun = useRunsStore((s) => s.addRun);
  const activeRun = useRunsStore((s) => s.getActiveRun());

  const [isRunning, setIsRunning] = useState(false);

  const handleRun = () => {
    if (!activeScenario) return;

    setIsRunning(true);
    setTimeout(() => {
      try {
        const result = runMonteCarloSync(activeScenario);
        addRun(result);
      } catch (error) {
        console.error("Simulation error:", error);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  if (!activeScenario) {
    return (
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="card h-96 flex flex-col items-center justify-center text-textMute">
          <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
          <p>No active scenario. Go to Scenario Studio to create one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{activeScenario.title}</h2>
          <p className="text-sm text-textMute">
            {activeScenario.runs.toLocaleString()} runs • {activeScenario.horizonDays} days
          </p>
        </div>
        <button onClick={handleRun} className="btn-primary gap-2" disabled={isRunning}>
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
            </>
          )}
        </button>
      </div>

      {activeRun && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: "P5", value: activeRun.summary.p5 },
              { label: "P50", value: activeRun.summary.p50 },
              { label: "P90", value: activeRun.summary.p90 },
              { label: "Mean", value: activeRun.summary.mean },
              { label: "Std Dev", value: activeRun.summary.stdev },
            ].map((metric) => (
              <div key={metric.label} className="card">
                <div className="text-sm text-textMute">{metric.label}</div>
                <div className="text-2xl font-bold mt-1">{metric.value.toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Distribution Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeRun.histogram}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="bin"
                  stroke="hsl(var(--text-mute))"
                  fontSize={11}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis stroke="hsl(var(--text-mute))" fontSize={11} />
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

          {/* Loss Exceedance Curve */}
          <div className="card">
            <h3 className="font-semibold mb-4">Loss Exceedance Curve</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={activeRun.lec}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="x"
                  stroke="hsl(var(--text-mute))"
                  fontSize={11}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis
                  stroke="hsl(var(--text-mute))"
                  fontSize={11}
                  tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tornado Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4">Sensitivity Analysis</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={activeRun.tornado} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--text-mute))" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="variable"
                  stroke="hsl(var(--text-mute))"
                  fontSize={11}
                  width={150}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="sensitivity" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!activeRun && !isRunning && (
        <div className="card h-96 flex items-center justify-center text-textMute">
          Click &quot;Run Simulation&quot; to see results
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Scenario Studio Tab
// ============================================================================
function ScenarioStudioTab() {
  const activeScenario = useScenarioStore((s) => s.getActiveScenario());
  const updateScenario = useScenarioStore((s) => s.updateScenario);
  const addScenario = useScenarioStore((s) => s.addScenario);

  const handleAddVariable = () => {
    if (!activeScenario) return;

    const newVar: ScenarioVariable = {
      id: generateId(),
      name: `Variable ${activeScenario.variables.length + 1}`,
      dist: "triangular",
      min: 0,
      mode: 50,
      max: 100,
    };

    updateScenario(activeScenario.id, {
      variables: [...activeScenario.variables, newVar],
    });
  };

  const handleDeleteVariable = (id: string) => {
    if (!activeScenario) return;
    updateScenario(activeScenario.id, {
      variables: activeScenario.variables.filter((v) => v.id !== id),
    });
  };

  const handleUpdateVariable = (id: string, updates: Partial<ScenarioVariable>) => {
    if (!activeScenario) return;
    updateScenario(activeScenario.id, {
      variables: activeScenario.variables.map((v) => (v.id === id ? { ...v, ...updates } : v)),
    });
  };

  const handleCreateNew = () => {
    const newScenario: ScenarioConfig = {
      id: generateId(),
      title: "New Scenario",
      horizonDays: 30,
      runs: 10000,
      seed: 42,
      correlation: "none",
      kpi: "days_out_of_stock",
      variables: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addScenario(newScenario);
  };

  if (!activeScenario) {
    return (
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="card h-96 flex flex-col items-center justify-center">
          <p className="text-textMute mb-4">No active scenario</p>
          <button onClick={handleCreateNew} className="btn-primary">
            Create New Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Scenario Studio</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="card">
          <h3 className="font-semibold mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-textMute">Title</label>
              <input
                type="text"
                value={activeScenario.title}
                onChange={(e) => updateScenario(activeScenario.id, { title: e.target.value })}
                className="input mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-textMute">Runs</label>
                <input
                  type="number"
                  value={activeScenario.runs}
                  onChange={(e) =>
                    updateScenario(activeScenario.id, { runs: Number(e.target.value) })
                  }
                  min={1000}
                  max={100000}
                  step={1000}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-textMute">Horizon (days)</label>
                <input
                  type="number"
                  value={activeScenario.horizonDays}
                  onChange={(e) =>
                    updateScenario(activeScenario.id, { horizonDays: Number(e.target.value) })
                  }
                  className="input mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-textMute">KPI</label>
              <select
                value={activeScenario.kpi}
                onChange={(e) =>
                  updateScenario(activeScenario.id, {
                    kpi: e.target.value as ScenarioConfig["kpi"],
                  })
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
        </div>

        {/* Variables */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Variables</h3>
            <button onClick={handleAddVariable} className="btn-secondary gap-2">
              <Plus className="w-4 h-4" />
              Add Variable
            </button>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {activeScenario.variables.map((v) => (
              <div key={v.id} className="p-3 rounded-lg border border-border bg-bg/30">
                <div className="flex items-start justify-between mb-2">
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => handleUpdateVariable(v.id, { name: e.target.value })}
                    className="input text-sm flex-1 mr-2"
                  />
                  <button
                    onClick={() => handleDeleteVariable(v.id)}
                    className="btn-ghost p-1 text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <select
                    value={v.dist}
                    onChange={(e) => handleUpdateVariable(v.id, { dist: e.target.value as any })}
                    className="input"
                  >
                    <option value="triangular">Triangular</option>
                    <option value="pert">PERT</option>
                    <option value="normal">Normal</option>
                    <option value="lognormal">Lognormal</option>
                  </select>

                  {(v.dist === "triangular" || v.dist === "pert") && (
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
                        value={v.mode ?? 0}
                        onChange={(e) =>
                          handleUpdateVariable(v.id, { mode: Number(e.target.value) })
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

                  {(v.dist === "normal" || v.dist === "lognormal") && (
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
                        value={v.stdev ?? 1}
                        onChange={(e) =>
                          handleUpdateVariable(v.id, { stdev: Number(e.target.value) })
                        }
                        className="input"
                        placeholder="Std Dev"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}

            {activeScenario.variables.length === 0 && (
              <div className="text-center text-textMute py-8">
                No variables yet. Click &quot;Add Variable&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Risk Register Tab
// ============================================================================
function RiskRegisterTab() {
  const risks = useRegisterStore((s) => s.risks);
  const addRisk = useRegisterStore((s) => s.addRisk);
  const deleteRisk = useRegisterStore((s) => s.deleteRisk);

  const handleAddRisk = () => {
    const newRisk: RiskItem = {
      id: generateId(),
      title: "New Risk",
      category: "Ops",
      likelihood: 3,
      impact: 3,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addRisk(newRisk);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Risk Register</h2>
        <button onClick={handleAddRisk} className="btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Risk
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk List */}
        <div className="lg:col-span-2 space-y-3">
          {risks.length === 0 && (
            <div className="card h-96 flex items-center justify-center text-textMute">
              No risks registered. Click &quot;Add Risk&quot; to create one.
            </div>
          )}

          {risks.map((risk) => {
            const riskScore = risk.likelihood * risk.impact;
            const color =
              riskScore >= 15 ? "danger" : riskScore >= 9 ? "warning" : "success";

            return (
              <div key={risk.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{risk.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded bg-${color}/20 text-${color}`}>
                        {risk.category}
                      </span>
                    </div>
                    {risk.description && (
                      <p className="text-sm text-textMute mt-2">{risk.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs">
                      <span className="text-textMute">L: {risk.likelihood}</span>
                      <span className="text-textMute">I: {risk.impact}</span>
                      <span className="font-semibold">Score: {riskScore}</span>
                      <span className="px-2 py-0.5 rounded bg-surface border border-border">
                        {risk.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteRisk(risk.id)}
                    className="btn-ghost p-1 text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Risk Heatmap */}
        <div className="card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Heatmap
          </h3>
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 25 }, (_, i) => {
              const likelihood = 5 - Math.floor(i / 5);
              const impact = (i % 5) + 1;
              const score = likelihood * impact;
              const count = risks.filter(
                (r) => r.likelihood === likelihood && r.impact === impact
              ).length;

              const color =
                score >= 15 ? "bg-danger/30" : score >= 9 ? "bg-warning/30" : "bg-success/30";

              return (
                <div
                  key={i}
                  className={`aspect-square flex items-center justify-center text-xs font-semibold rounded ${color} border border-border`}
                >
                  {count || ""}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-textMute text-center">
            Likelihood (5=High) × Impact (5=High)
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Page Component
// ============================================================================
export default function RiskCoachNeoPage() {
  const activeTab = useUiStore((s) => s.activeTab);
  const scenarios = useScenarioStore((s) => s.scenarios);
  const addScenario = useScenarioStore((s) => s.addScenario);
  const setActiveScenario = useScenarioStore((s) => s.setActiveScenario);

  // Initialize with default scenario
  useEffect(() => {
    if (scenarios.length === 0) {
      const defaultScenario: ScenarioConfig = {
        id: generateId(),
        title: "Supply Chain Risk Analysis",
        horizonDays: 30,
        runs: 10000,
        seed: 42,
        correlation: "none",
        kpi: "days_out_of_stock",
        variables: [
          {
            id: generateId(),
            name: "Supplier Delay",
            unit: "days",
            dist: "pert",
            min: 7,
            mode: 14,
            max: 30,
          },
          {
            id: generateId(),
            name: "Stock Coverage",
            unit: "days",
            dist: "triangular",
            min: 8,
            mode: 12,
            max: 18,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      addScenario(defaultScenario);
      setActiveScenario(defaultScenario.id);
    }
  }, [scenarios.length, addScenario, setActiveScenario]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-drift animate-drift pointer-events-none opacity-40" />

      {/* Tab Content */}
      <div className="relative">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "monte-carlo" && <MonteCarloTab />}
        {activeTab === "scenario-studio" && <ScenarioStudioTab />}
        {activeTab === "register" && <RiskRegisterTab />}
      </div>
    </motion.div>
  );
}
