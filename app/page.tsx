"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Loader from "./components/Loader";
import PlanCard from "./components/PlanCard";
import NavBar from "./components/NavBar";
import Particles from "./components/Particles";
import TopMetrics from "./components/TopMetrics";
import TemplatesDrawer from "./components/TemplatesDrawer";
import HistoryPanel from "./components/HistoryPanel";
import ConfidenceGauge from "./components/ConfidenceGauge";
import HeatmapMini from "./components/HeatmapMini";
import Tour from "./components/Tour";
import { loadHistory, makeSaved, useCoach } from "./store/useCoach";
import { clampInput, redactPII } from "./lib/redact";

type CoachResponse = { reply?: string; plan?: any; error?: string; score?: number };

export default function Home() {
  const [text, setText] = useState<string>("");
  const [out, setOut] = useState<CoachResponse | null>(null);
  const [status, setStatus] = useState<"idle"|"thinking"|"done"|"error">("idle");

  const add = useCoach(s => s.add);
  const items = useCoach(s => s.items);

  useEffect(() => loadHistory(), []);
  useEffect(() => { if (!text) setOut(null); }, [text]);

  async function handleClick() {
    if (!text.trim()) return;
    setStatus("thinking"); setOut(null);

    // compliance helpers
    const safe = redactPII(clampInput(text));
    console.log("[Risk Coach] Sending request with message:", safe);

    try {
      const res = await fetch("/api/riskcoach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: safe }),
      });

      console.log("[Risk Coach] Response status:", res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("[Risk Coach] API error:", errorText);
        setOut({ reply: `API error (${res.status}): ${errorText}` });
        setStatus("error");
        return;
      }

      const data = await res.json() as CoachResponse;
      console.log("[Risk Coach] Response data:", data);
      console.log("[Risk Coach] Has plan:", !!data.plan);
      console.log("[Risk Coach] Has reply:", !!data.reply);

      setOut(data);
      setStatus("done");
      add(makeSaved(safe, data));
    } catch (err) {
      console.error("[Risk Coach] Caught error:", err);
      setOut({ reply: "Network error. Try again." });
      setStatus("error");
    }
  }

  function loadFromHistory(id: string) {
    const found = items.find(x => x.id === id);
    if (!found) return;
    setText(found.input);
    setOut({ plan: found.plan, reply: found.reply, score: 0.7 });
  }

  const confidence = useMemo(() => {
    const raw = out?.plan?.confidence || out?.score || 0.66;
    if (typeof raw === "number") return raw;
    const m = String(raw || "").match(/(\d{1,3})%/);
    return m ? Math.min(1, Math.max(0, Number(m[1]) / 100)) : 0.66;
  }, [out]);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-drift animate-drift pointer-events-none" />
      <Particles />
      <NavBar />
      <Tour />

      <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-6">
        <TopMetrics />

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left column */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-4">
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-inkg">
              <h1 className="text-xl font-semibold">Risk Coach</h1>
              <p className="text-sm text-textMute">Describe the situation. Get a step by step plan.</p>
              <textarea
                value={text}
                onChange={(e)=>setText(e.target.value)}
                rows={7}
                className="mt-3 w-full rounded-lg border border-border bg-bg/60 p-3 focus:ring-2 focus:ring-primary outline-none"
                placeholder="Supplier delay, 10 days of stock, no backup supplier..."
                maxLength={800}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-bg bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-glow disabled:opacity-60"
                  disabled={status === "thinking"}
                >
                  {status === "thinking" ? <Loader /> : null}
                  {status === "thinking" ? "Thinking..." : "Get Guidance"}
                </button>
                <span className="text-xs text-textMute">PII is redacted and length is limited for safety.</span>
              </div>
            </div>

            <TemplatesDrawer onPick={(t) => setText(t)} />
            <HistoryPanel onLoad={(id) => loadFromHistory(id)} />
          </motion.div>

          {/* Right column */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-3 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface border border-border p-4">
                <ConfidenceGauge score={confidence} />
              </div>
              <div className="rounded-2xl bg-surface border border-border p-4">
                <div className="text-sm font-medium mb-1">Activity last 28 days</div>
                <HeatmapMini />
              </div>
            </div>

            {status === "idle" && !out && (
              <div className="h-[420px] border border-dashed border-border rounded-2xl bg-surface/60 flex items-center justify-center text-textMute">
                Your adaptive plan will appear here.
              </div>
            )}

            {status === "thinking" && (
              <div className="h-[420px] border border-border rounded-2xl bg-surface p-6 flex items-center gap-3 text-text">
                <Loader />
                <span className="bg-gradient-to-r from-text/30 via-text/70 to-text/30 bg-clip-text text-transparent shimmer animate-shimmer">
                  Generating your plan...
                </span>
              </div>
            )}

            {status !== "thinking" && out?.plan && <PlanCard plan={out.plan} />}

            {status !== "thinking" && !out?.plan && out?.reply && (
              <div className="bg-surface border border-border rounded-2xl p-5">
                <pre className="whitespace-pre-wrap text-sm">{out.reply}</pre>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
