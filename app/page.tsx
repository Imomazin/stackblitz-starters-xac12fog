"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Loader from "./components/Loader";
import PlanCard from "./components/PlanCard";
import NavBar from "./components/NavBar";

type CoachResponse = { reply?: string; plan?: any; error?: string };

export default function Home() {
  const [text, setText] = useState("");
  const [out, setOut] = useState<CoachResponse | null>(null);
  const [status, setStatus] = useState<"idle"|"thinking"|"done"|"error">("idle");

  async function handleClick() {
    if (!text.trim()) return;
    setStatus("thinking");
    setOut(null);
    try {
      const res = await fetch("/api/riskcoach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setOut(data);
      setStatus("done");
    } catch (e) {
      setOut({ reply: "Network error. Try again." });
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-drift animate-drift pointer-events-none" />
      <NavBar />

      <div className="relative max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-5 gap-6">
        {/* Left panel */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-inkg">
            <h1 className="text-xl font-semibold">Risk Coach</h1>
            <p className="text-sm text-textMute">Describe the situation. Get a step by step plan.</p>
            <textarea
              value={text}
              onChange={(e)=>setText(e.target.value)}
              rows={7}
              className="mt-3 w-full rounded-lg border border-border bg-bg/60 p-3 focus:ring-2 focus:ring-primary outline-none"
              placeholder="Supplier delay, 10 days of stock, no backup supplier..."
            />
            <button
              onClick={handleClick}
              className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-bg
                        bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-glow disabled:opacity-60"
              disabled={status === "thinking"}
            >
              {status === "thinking" ? <Loader /> : null}
              {status === "thinking" ? "Thinking..." : "Get Guidance"}
            </button>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-sm font-medium mb-2">Tips</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-textMute">
              <li>Include timeframes and impact where possible.</li>
              <li>Keep it to one or two sentences.</li>
              <li>Avoid sensitive data.</li>
            </ul>
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-3 space-y-4"
        >
          {status === "idle" && !out && (
            <div className="h-[420px] border border-dashed border-border rounded-2xl bg-surface/60
                            flex items-center justify-center text-textMute">
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
    </main>
  );
}
