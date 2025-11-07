"use client";
import { motion } from "framer-motion";

function Badge({ rating }: { rating?: string }) {
  const r = (rating || "").toLowerCase();
  const c = r.startsWith("high")
    ? "bg-highlight/20 text-highlight"
    : r.startsWith("medium")
    ? "bg-primary/15 text-primary"
    : r.startsWith("low")
    ? "bg-secondary/20 text-secondary"
    : "bg-border text-text";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${c}`}>{rating || "Unrated"}</span>;
}

export default function PlanCard({ plan }: { plan: any }) {
  const list = (x: any) => (Array.isArray(x) ? x : []);
  const copy = async (text: string) => navigator.clipboard.writeText(text || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-surface border border-border rounded-2xl p-5 shadow-inkg"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold">{plan?.summary || "AI plan"}</h3>
        <Badge rating={plan?.rating} />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <section>
          <h4 className="text-sm text-textMute mb-1">24 hours</h4>
          <ul className="list-disc pl-5 space-y-1">{list(plan?.actions_24h).map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
        </section>
        <section>
          <h4 className="text-sm text-textMute mb-1">7 days</h4>
          <ul className="list-disc pl-5 space-y-1">{list(plan?.actions_7d).map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
        </section>
        <section>
          <h4 className="text-sm text-textMute mb-1">30 days</h4>
          <ul className="list-disc pl-5 space-y-1">{list(plan?.actions_30d).map((a: string, i: number) => <li key={i}>{a}</li>)}</ul>
        </section>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm text-textMute mb-1">Owners</h4>
          <p>{list(plan?.owners).join(", ") || "Unassigned"}</p>
        </div>
        <div>
          <h4 className="text-sm text-textMute mb-1">Checklist</h4>
          <ul className="list-disc pl-5 space-y-1">{list(plan?.checklist).map((c: string, i: number) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm text-textMute mb-1">Template</h4>
        <pre className="whitespace-pre-wrap font-mono text-sm bg-bg/40 p-3 rounded-lg border border-border">{plan?.template || ""}</pre>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={() => copy(JSON.stringify(plan, null, 2))} className="px-3 py-1.5 rounded border border-border hover:bg-surface/70 text-sm">Copy JSON</button>
        <button onClick={() => copy(plan?.template || "")} className="px-3 py-1.5 rounded border border-border hover:bg-surface/70 text-sm">Copy Template</button>
      </div>
    </motion.div>
  );
}
