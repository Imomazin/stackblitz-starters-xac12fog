"use client";
import { useState } from "react";
import Spinner from "./components/Spinner";
import PlanView from "./components/PlanView";

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
    } catch (e:any) {
      setOut({ reply: "Network error. Try again.", error: String(e) });
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl p-4 md:p-8 grid md:grid-cols-5 gap-6">
        {/* Left panel */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h1 className="text-xl font-semibold">Risk Coach</h1>
            <p className="text-sm text-gray-600">Describe the situation. Get a step by step plan.</p>
            <textarea
              value={text}
              onChange={(e)=>setText(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Supplier delay, 10 days of stock, no backup supplier..."
            />
            <button
              onClick={handleClick}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 hover:opacity-90 disabled:opacity-50"
              disabled={status==="thinking"}
            >
              {status==="thinking" ? <Spinner/> : null}
              {status==="thinking" ? "Thinking..." : "Get Guidance"}
            </button>
            {status==="error" && <p className="mt-2 text-sm text-rose-600">{out?.reply}</p>}
          </div>

          {/* Mini tips */}
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <p className="text-sm font-medium mb-2">Tips</p>
            <ul className="text-sm list-disc pl-5 space-y-1 text-gray-700">
              <li>Include timeframes and impact when you can.</li>
              <li>Keep it to 1 or 2 sentences.</li>
              <li>Do not paste sensitive data.</li>
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="md:col-span-3">
          {!out && status==="idle" && (
            <div className="h-full rounded-2xl border border-dashed bg-white/60 p-8 text-gray-500">
              Your plan will appear here.
            </div>
          )}
          {status==="thinking" && (
            <div className="h-full rounded-2xl border bg-white p-8 flex items-center gap-3 text-gray-700">
              <Spinner/><span>Generating your plan...</span>
            </div>
          )}
          {status!=="thinking" && out?.plan && <PlanView plan={out.plan} />}
          {status!=="thinking" && !out?.plan && out?.reply && (
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <pre className="whitespace-pre-wrap text-sm">{out.reply}</pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
