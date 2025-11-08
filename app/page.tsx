"use client";

import { useState, useMemo } from "react";

type RiskCoachResponse = {
  plan?: any;
  reply?: string;
  score?: number; // 0..1
  text?: string;  // human-friendly text block for UI
  error?: string;
  details?: unknown;
  rating?: string;
  checklist?: string[];
  _source?: string;
  _requestId?: string;
  _model?: string;
};

export default function Page() {
  // form/input
  const [message, setMessage] = useState(
    "Supplier shipment delayed by 3 weeks due to port congestion. Stock covers 10 days."
  );

  // ui state
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<RiskCoachResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confidencePct = useMemo(() => {
    if (!out?.score && out?.score !== 0) return null;
    const pct = Math.round((Math.min(Math.max(out.score, 0), 1)) * 100);
    return pct;
  }, [out?.score]);

  const displayText = useMemo(() => {
    if (!out) return "";
    // Try different fields for display text
    if (out.text) return out.text;
    if (out.reply) return out.reply;
    if (out.plan?.summary) return out.plan.summary;
    return "";
  }, [out]);

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setOut(null);

    console.log("[VLV Risk Coach] 🚀 Submitting request...");
    console.log("[VLV Risk Coach] Message:", message);

    try {
      const res = await fetch("/api/riskcoach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      console.log("[VLV Risk Coach] 📡 Response status:", res.status, res.statusText);

      if (!res.ok) {
        // capture raw error body
        let raw = "";
        try {
          raw = await res.text();
          console.error("[VLV Risk Coach] ❌ Error response body:", raw);
        } catch (e) {
          console.error("[VLV Risk Coach] ❌ Could not read error body:", e);
        }
        throw new Error(`HTTP ${res.status}: ${raw || res.statusText}`);
      }

      const data = (await res.json()) as RiskCoachResponse;
      console.log("[VLV Risk Coach] ✅ Success! Response data:", data);
      console.log("[VLV Risk Coach] 📊 Has plan:", !!data.plan);
      console.log("[VLV Risk Coach] 📝 Has reply:", !!data.reply);
      console.log("[VLV Risk Coach] 🎯 Score:", data.score);
      console.log("[VLV Risk Coach] 🔧 Source:", data._source);
      console.log("[VLV Risk Coach] 🆔 Request ID:", data._requestId);

      setOut(data);
    } catch (err: any) {
      console.error("[VLV Risk Coach] 💥 Caught error:", err);
      const errorMsg = err?.message || "Something went wrong contacting the API.";
      setError(errorMsg);
    } finally {
      setLoading(false);
      console.log("[VLV Risk Coach] ✨ Request complete");
    }
  }

  function Copy({ text }: { text: string }) {
    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(text);
          console.log("[VLV Risk Coach] 📋 Copied to clipboard");
        }}
        className="px-3 py-1 text-sm rounded-md border border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!text}
        title="Copy to clipboard"
      >
        Copy
      </button>
    );
  }

  // Helper to render plan sections
  function PlanSection({ title, items }: { title: string; items?: string[] }) {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-neutral-300 mb-2">{title}</h4>
        <ul className="space-y-1.5">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-neutral-400 flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">VLV Risk Coach</h1>
          <p className="text-neutral-400">
            Describe the situation. Get a step-by-step plan.
          </p>
          {out?._source && (
            <p className="text-xs text-neutral-600 mt-1">
              Powered by: {out._source === 'anthropic' ? '🤖 Anthropic Claude' : '📦 Mock Data'}
              {out._model && ` (${out._model})`}
            </p>
          )}
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form + tips */}
          <section className="lg:col-span-1 space-y-4">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4"
            >
              <label className="block text-sm mb-2 text-neutral-300">
                Risk Coach
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-40 rounded-lg bg-neutral-900 border border-neutral-800 px-3 py-2 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 transition-all"
                placeholder="e.g. Supplier delay, 10 days of stock, no backup supplier…"
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Thinking…" : "Get Guidance"}
                </button>
                <span className="text-xs text-neutral-500">
                  PII is redacted and length is limited for safety.
                </span>
              </div>
            </form>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
              <h3 className="text-sm text-neutral-300 mb-2">Templates</h3>
              <div className="space-y-2">
                {[
                  "Supplier shipment delayed by 3 weeks due to port congestion. Stock covers 10 days.",
                  "Payment processor outage impacted 12% of checkouts for 90 minutes.",
                  "Key engineer on leave. Delivery risk on Release 1.3 within two weeks.",
                  "New regulation may affect data retention policy. Evaluate in 30 days.",
                ].map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMessage(t);
                      console.log("[VLV Risk Coach] 📝 Template selected:", idx);
                    }}
                    className="w-full text-left text-sm rounded-md border border-neutral-800 hover:bg-neutral-900/70 hover:border-neutral-700 px-3 py-2 transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right: output */}
          <section className="lg:col-span-2 space-y-4">
            {/* Error panel */}
            {error && (
              <div className="rounded-xl border border-red-900/60 bg-red-900/20 p-4 text-red-200">
                <div className="font-medium mb-1">❌ API Error</div>
                <pre className="whitespace-pre-wrap text-sm">{error}</pre>
                <div className="mt-3 text-xs text-red-300">
                  💡 Check browser console (F12) for detailed logs
                </div>
              </div>
            )}

            {/* Confidence + Activity cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="text-sm text-neutral-400">Confidence</div>
                <div className="mt-2 text-3xl font-semibold">
                  {confidencePct === null ? "—" : `${confidencePct}%`}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {out?.plan?.rating || "Basic heuristic (0–100)"}
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="text-sm text-neutral-400">Plans today</div>
                <div className="mt-2 text-3xl font-semibold">
                  {out ? 1 : 0}
                </div>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="text-sm text-neutral-400">Activity (last 28d)</div>
                <div className="mt-2 text-3xl font-semibold">—</div>
              </div>
            </div>

            {/* Human-friendly guidance */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-neutral-300">Guidance</h3>
                <Copy text={displayText} />
              </div>
              <div className="min-h-[140px] rounded-lg bg-neutral-950/60 border border-neutral-800 p-3">
                {!out && !loading && (
                  <div className="text-neutral-500 text-sm">
                    Your adaptive plan will appear here.
                  </div>
                )}
                {loading && (
                  <div className="text-neutral-400 text-sm flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                    Generating your plan...
                  </div>
                )}
                {!loading && !!displayText && (
                  <pre className="whitespace-pre-wrap text-sm text-neutral-200">
                    {displayText}
                  </pre>
                )}
              </div>
            </div>

            {/* Structured Plan with Actions */}
            {out?.plan && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-neutral-300">Action Plan</h3>
                  <Copy text={JSON.stringify(out.plan, null, 2)} />
                </div>
                <div className="space-y-4">
                  <PlanSection title="⚡ Next 24 Hours" items={out.plan.actions_24h} />
                  <PlanSection title="📅 Next 7 Days" items={out.plan.actions_7d} />
                  <PlanSection title="🗓️ Next 30 Days" items={out.plan.actions_30d} />

                  {out.plan.owners && out.plan.owners.length > 0 && (
                    <div className="pt-3 border-t border-neutral-800">
                      <h4 className="text-sm font-medium text-neutral-300 mb-2">👥 Key Owners</h4>
                      <div className="flex flex-wrap gap-2">
                        {out.plan.owners.map((owner: string, idx: number) => (
                          <span key={idx} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                            {owner}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {out.checklist && out.checklist.length > 0 && (
                    <div className="pt-3 border-t border-neutral-800">
                      <h4 className="text-sm font-medium text-neutral-300 mb-2">✅ Checklist</h4>
                      <ul className="space-y-1.5">
                        {out.checklist.map((item, idx) => (
                          <li key={idx} className="text-sm text-neutral-400 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">☐</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {out.plan.template && (
                    <div className="pt-3 border-t border-neutral-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-neutral-300">📧 Communication Template</h4>
                        <Copy text={out.plan.template} />
                      </div>
                      <pre className="text-xs text-neutral-400 bg-neutral-950/60 p-3 rounded border border-neutral-800 whitespace-pre-wrap">
                        {out.plan.template}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Raw plan JSON (debugging) */}
            <details className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4">
              <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                🔍 Debug: Raw Response (click to expand)
              </summary>
              <div className="mt-3 min-h-[120px] rounded-lg bg-neutral-950/60 border border-neutral-800 p-3">
                {out ? (
                  <pre className="text-xs text-neutral-300 overflow-x-auto">
                    {JSON.stringify(out, null, 2)}
                  </pre>
                ) : (
                  <div className="text-neutral-500 text-sm">No data yet.</div>
                )}
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
}
