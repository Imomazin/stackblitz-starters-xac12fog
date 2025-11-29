'use client';

import { useState } from 'react';
import { useRiskAdvisor, type RiskAdvisorReply } from '@/lib/useRiskAdvisor';
import { AlertTriangle, CheckCircle, Loader2, Send, TrendingUp } from 'lucide-react';

export default function RiskAdvisorDemoPage() {
  const { getPlan, loading, error } = useRiskAdvisor();
  const [message, setMessage] = useState('');
  const [contextJson, setContextJson] = useState('{\n  "business_unit": "Electronics",\n  "region": "EMEA"\n}');
  const [result, setResult] = useState<RiskAdvisorReply | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    let context: any = undefined;
    try {
      if (contextJson.trim()) {
        context = JSON.parse(contextJson);
      }
    } catch (err) {
      alert('Invalid JSON in context field');
      return;
    }

    const data = await getPlan(message, context);
    setResult(data);
  };

  const getLikelihoodColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Risk Advisor Demo
          </h1>
          <p className="text-textMute">
            Test the structured JSON API for R_Lumina&apos;s AI Risk Advisor
          </p>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Message Input */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <label className="block text-sm font-semibold mb-2">
              Risk Scenario Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Supplier delay for 14 days; we have 10 days of stock. What do we do first?"
              className="w-full h-32 bg-background border border-border rounded-lg px-4 py-3 text-text placeholder:text-textMute focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Context Input */}
          <div className="bg-surface border-2 border-border rounded-xl p-6">
            <label className="block text-sm font-semibold mb-2">
              Context (Optional JSON)
            </label>
            <textarea
              value={contextJson}
              onChange={(e) => setContextJson(e.target.value)}
              placeholder='{"business_unit": "Electronics", "region": "EMEA"}'
              className="w-full h-32 bg-background border border-border rounded-lg px-4 py-3 text-text font-mono text-sm placeholder:text-textMute focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Risk...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Get Risk Advisory
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-500 mb-1">Error</h3>
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-surface border-2 border-primary/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Risk Advisory Summary</h2>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-lg font-semibold">
                    Risk Score: {(result.score * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="text-textMute text-lg">{result.summary}</p>
              {result.error && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <p className="text-yellow-500 text-sm">
                    ⚠️ Degraded response: {result.error}
                  </p>
                </div>
              )}
            </div>

            {/* Action Plan */}
            <div className="bg-surface border-2 border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Recommended Action Plan
              </h3>
              <ol className="space-y-3">
                {result.plan.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="bg-primary text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-textMute flex-1 pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Risks */}
            <div className="bg-surface border-2 border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Key Risks Identified
              </h3>
              <div className="space-y-4">
                {result.key_risks.map((risk, idx) => (
                  <div key={idx} className="bg-background border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">{risk.name}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-textMute">Likelihood: </span>
                        <span className={`font-semibold capitalize ${getLikelihoodColor(risk.likelihood)}`}>
                          {risk.likelihood}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-textMute">Impact: </span>
                        <span className={`font-semibold capitalize ${getImpactColor(risk.impact)}`}>
                          {risk.impact}
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-sm text-textMute">
                        <span className="font-semibold text-text">Mitigation: </span>
                        {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            {result.meta && (
              <div className="bg-surface border border-border rounded-xl p-4">
                <h4 className="text-sm font-semibold mb-2 text-textMute">Response Metadata</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {result.meta.model && (
                    <div>
                      <span className="text-textMute">Model: </span>
                      <code className="text-primary">{result.meta.model}</code>
                    </div>
                  )}
                  {result.meta.request_id && (
                    <div>
                      <span className="text-textMute">Request ID: </span>
                      <code className="text-primary text-xs">{result.meta.request_id.slice(0, 16)}...</code>
                    </div>
                  )}
                  {result.meta.tokens && (
                    <div>
                      <span className="text-textMute">Tokens: </span>
                      <code className="text-primary">
                        {result.meta.tokens.input}→{result.meta.tokens.output}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        {!result && !loading && (
          <div className="mt-12 bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Example Scenarios</h3>
            <div className="space-y-3">
              <button
                onClick={() => setMessage('Supplier delay for 14 days; we have 10 days of stock. What do we do first?')}
                className="w-full text-left bg-background hover:bg-background/80 border border-border rounded-lg p-3 transition-colors"
              >
                <p className="text-sm text-textMute">Supply Chain Risk</p>
                <p className="text-text">Supplier delay for 14 days; we have 10 days of stock...</p>
              </button>
              <button
                onClick={() => setMessage('We detected unauthorized access attempts on our production database. What are the immediate steps?')}
                className="w-full text-left bg-background hover:bg-background/80 border border-border rounded-lg p-3 transition-colors"
              >
                <p className="text-sm text-textMute">Cybersecurity Incident</p>
                <p className="text-text">Unauthorized access attempts on production database...</p>
              </button>
              <button
                onClick={() => setMessage('Major regulatory change announced that affects 40% of our product portfolio. Timeline: 6 months.')}
                className="w-full text-left bg-background hover:bg-background/80 border border-border rounded-lg p-3 transition-colors"
              >
                <p className="text-sm text-textMute">Regulatory Risk</p>
                <p className="text-text">Major regulatory change affecting 40% of product portfolio...</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
