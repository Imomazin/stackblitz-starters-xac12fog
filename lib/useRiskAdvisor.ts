import { useState } from "react";

export type RiskAdvisorReply = {
  plan: string[];
  summary: string;
  score: number; // 0..1
  key_risks: Array<{
    name: string;
    likelihood: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    mitigation: string;
  }>;
  meta?: {
    request_id?: string;
    model?: string;
    tokens?: { input?: number; output?: number };
  };
  error?: string; // optional, only when degraded
};

export function useRiskAdvisor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getPlan(message: string, context?: any): Promise<RiskAdvisorReply | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/risk-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context }),
      });
      const data = await res.json();
      if (!res.ok && data?.error) throw new Error(data.error);
      return data; // RiskAdvisorReply
    } catch (err: any) {
      setError(err?.message ?? "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { getPlan, loading, error };
}
