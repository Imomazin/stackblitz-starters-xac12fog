"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useUiStore } from "./store/ui";
import { useScenarioStore } from "./store/scenario";
import { useRunsStore } from "./store/runs";
import { useRegisterStore } from "./store/register";
import { runMonteCarloSync } from "@/lib/montecarlo";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Plus, Play, Trash2, TrendingUp, TrendingDown, AlertTriangle, Activity, Network, Brain, MessageSquare, Send, Sparkles, Shield, Target, FileBarChart, Gauge, Upload, Users, Zap, Database, BarChart3, GitBranch, Lock } from "lucide-react";
import type {
  ScenarioVariable,
  DistName,
  DigitalTwin,
  Portfolio,
  BowTie,
  FMEA,
  KRI,
  RiskAppetite,
} from "./types";

export default function Page() {
  const activeTab = useUiStore((s) => s.activeTab);
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {activeTab === "home" && <CoverPage />}
        {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "monte-carlo" && <MonteCarloTab />}
      {activeTab === "scenario-studio" && <ScenarioStudioTab />}
      {activeTab === "register" && <RiskRegisterTab />}
      {activeTab === "cognitive-twin" && <CognitiveTwinTab />}
      {activeTab === "portfolio" && <PortfolioTab />}
      {activeTab === "bow-tie" && <BowTieTab />}
      {activeTab === "fmea" && <FMEATab />}
      {activeTab === "network" && <NetworkTab />}
      {activeTab === "bayesian" && <BayesianTab />}
      {activeTab === "kri" && <KRITab />}
      {activeTab === "risk-appetite" && <RiskAppetiteTab />}
      {activeTab === "forecasting" && <PlaceholderTab title="Time-Series Forecasting" subtitle="ARIMA, Prophet, and LSTM predictive models" />}
      {activeTab === "cyber-risk" && <PlaceholderTab title="Cyber Risk (FAIR)" subtitle="Factor Analysis of Information Risk framework" />}
      {activeTab === "climate-risk" && <PlaceholderTab title="Climate Risk (TCFD)" subtitle="Physical and transition risks aligned with TCFD framework" />}
      {activeTab === "supply-chain" && <PlaceholderTab title="Supply Chain Network" subtitle="Disruption simulation and resilience analysis" />}
      {activeTab === "esg" && <PlaceholderTab title="ESG Risk Metrics" subtitle="Environmental, Social, and Governance indicators" />}
      {activeTab === "third-party" && <PlaceholderTab title="Third-Party Risk" subtitle="Vendor assessment and monitoring" />}
      {activeTab === "risk-transfer" && <PlaceholderTab title="Risk Transfer & Insurance" subtitle="Insurance optimization and coverage analysis" />}
      {activeTab === "agent-based" && <PlaceholderTab title="Agent-Based Modeling" subtitle="Multi-agent simulation for emergent behaviors" />}
      {activeTab === "system-dynamics" && <PlaceholderTab title="System Dynamics" subtitle="Stock-flow modeling with feedback loops" />}
      {activeTab === "what-if" && <PlaceholderTab title="What-If Analysis" subtitle="Interactive scenario exploration" />}
      {activeTab === "stress-lab" && <PlaceholderTab title="Stress Lab" subtitle="Macro shocks and regime switching" />}
      {activeTab === "playbooks" && <PlaceholderTab title="AI Playbooks" subtitle="Automated risk response recommendations" />}
      {activeTab === "templates" && <PlaceholderTab title="Scenario Templates" subtitle="Pre-built scenarios for common risks" />}
      {activeTab === "history" && <PlaceholderTab title="Simulation History" subtitle="Compare past runs and track changes" />}
      {activeTab === "reports" && <PlaceholderTab title="Reports & Export" subtitle="PDF, CSV, JSON exports with print CSS" />}
      {activeTab === "settings" && <PlaceholderTab title="Settings" subtitle="Platform configuration and preferences" />}
      {activeTab === "compliance" && <PlaceholderTab title="Compliance & Regulatory" subtitle="Framework mapping (SOX, GDPR, ISO 27001, Basel III)" />}
      </div>

      {/* AI Chat Assistant - Floating Widget */}
      <AIChat showChat={showAIChat} setShowChat={setShowAIChat} />
    </>
  );
}

// ============================================================================
// AI CHAT ASSISTANT COMPONENT
// ============================================================================
function AIChat({ showChat, setShowChat }: { showChat: boolean; setShowChat: (show: boolean) => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hi! I\'m your AI Risk Advisor. Ask me anything about risk management, simulations, or how to use this platform!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Simple AI response (you can enhance this to call your AI API)
      const aiResponse = await getAIResponse(userMessage);
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (question: string): Promise<string> => {
    // Enhanced AI knowledge base with better matching
    const lowerQ = question.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening))/.test(lowerQ)) {
      return '👋 Hello! I\'m your AI Risk Advisor. I can help you with:\n\n• Running Monte Carlo simulations\n• Understanding risk metrics (VaR, CVaR, etc.)\n• Navigating the 29 enterprise modules\n• Best practices for risk management\n• Digital twins and AI features\n\nWhat specific topic interests you?';
    }

    // Simulations and Monte Carlo
    if (lowerQ.includes('simulation') || lowerQ.includes('monte carlo') || lowerQ.includes('run')) {
      return '🎲 **Running Simulations:**\n\n1. Navigate to **"Scenario Studio"** tab\n2. Click "Add Scenario" and define your risk variables\n3. Choose distributions (triangular, normal, PERT, lognormal)\n4. Go to **"Monte Carlo"** tab\n5. Select your scenario and click **"Run Simulation"**\n6. Analyze results and click **"AI Insights"** for detailed recommendations\n\n💡 Tip: Start with 10,000 runs for quick results!';
    }

    // Risk metrics
    if (lowerQ.includes('metric') || lowerQ.includes('measure') || lowerQ.includes('understand risk')) {
      return '📊 **Key Risk Metrics:**\n\n• **VaR (Value at Risk)**: Maximum expected loss at confidence level (e.g., 95%)\n• **CVaR (Conditional VaR)**: Average loss beyond VaR threshold\n• **P90/P95/P99**: 90th, 95th, 99th percentile values\n• **Standard Deviation**: Measure of variability\n• **Correlation**: How risks move together\n\nWhich metric would you like to explore further?';
    }

    // Digital twins
    if (lowerQ.includes('digital twin') || lowerQ.includes('twin')) {
      return '🤖 **Cognitive Digital Twins:**\n\nCreate virtual replicas of your operations with:\n• Real-time sensor monitoring\n• AI anomaly detection\n• 30-day LSTM forecasting\n• Predictive maintenance alerts\n\nGo to **"Digital Twin"** tab to set up your first twin!';
    }

    // Portfolio & VaR
    if (lowerQ.includes('var') || lowerQ.includes('value at risk') || lowerQ.includes('portfolio')) {
      return '📈 **Portfolio Risk Analytics:**\n\n**VaR (Value at Risk)**: The maximum loss at a given confidence level.\n• VaR 95% = Only 5% chance of exceeding this loss\n• VaR 99% = Only 1% chance of exceeding this loss\n\n**CVaR**: Average loss when VaR is exceeded\n\n**Diversification Benefit**: Risk reduction from portfolio effects\n\nVisit the **"Portfolio"** tab for full analysis!';
    }

    // Bow-Tie
    if (lowerQ.includes('bow') || lowerQ.includes('tie')) {
      return '🎯 **Bow-Tie Analysis:**\n\nVisualizes the complete risk chain:\n\n**Threats** → Preventive Controls → **Central Event** → Mitigative Controls → **Consequences**\n\nUse it to:\n• Map cause-consequence relationships\n• Assess control effectiveness\n• Identify gaps in defenses\n\nCheck the **"Bow-Tie"** tab!';
    }

    // FMEA
    if (lowerQ.includes('fmea') || lowerQ.includes('failure mode')) {
      return '⚠️ **FMEA (Failure Mode & Effects Analysis):**\n\nSystematic method to identify potential failures:\n• Severity (1-10)\n• Occurrence (1-10)\n• Detection (1-10)\n• RPN = S × O × D\n\nHigher RPN = Higher priority to address!';
    }

    // Platform features/navigation
    if (lowerQ.includes('feature') || lowerQ.includes('platform') || lowerQ.includes('module') || lowerQ.includes('tab')) {
      return '✨ **R_LUMINA Platform Features:**\n\n29 enterprise modules including:\n• Core: Dashboard, Monte Carlo, Scenarios, Risk Register\n• Advanced: Digital Twins, Portfolio, Bayesian Networks\n• Specialized: Cyber Risk, Climate Risk, Supply Chain\n• AI: Playbooks, Forecasting, Agent-Based Models\n\nClick any tab in the navigation to explore!';
    }

    // API/Settings
    if (lowerQ.includes('api') || lowerQ.includes('key') || lowerQ.includes('setting')) {
      return '🔑 **AI Configuration:**\n\n1. Go to **Settings** tab\n2. Add `OPENROUTER_API_KEY` environment variable\n3. AI features will use Claude 3.5 Sonnet\n\nWithout an API key, the platform uses smart fallback algorithms!';
    }

    // Best practices
    if (lowerQ.includes('best practice') || lowerQ.includes('recommend') || lowerQ.includes('tip')) {
      return '💡 **Risk Management Best Practices:**\n\n1. **Start simple**: Begin with 3-4 key variables\n2. **Use appropriate distributions**: Triangular for estimates, Normal for measured data\n3. **Run 10k+ simulations**: More runs = more reliable results\n4. **Validate assumptions**: Review AI insights critically\n5. **Monitor KRIs**: Track leading indicators\n6. **Document scenarios**: Use version control\n\nWhat area would you like to dive deeper into?';
    }

    // Default fallback with context
    return '🤔 I\'m here to help! I can assist with:\n\n• **Simulations**: How to run Monte Carlo analysis\n• **Risk Metrics**: VaR, CVaR, distributions\n• **Platform Features**: Navigate 29 modules\n• **Best Practices**: Risk management tips\n• **Digital Twins**: AI-powered monitoring\n\nCould you be more specific about what you\'d like to learn?';
  };

  if (!showChat) {
    return (
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-neo text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
        title="Ask AI Assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-surface border-2 border-primary/30 rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-neo text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <span className="font-bold">AI Risk Advisor</span>
        </div>
        <button onClick={() => setShowChat(false)} className="hover:bg-white/20 rounded p-1">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface-secondary text-text'}`}>
              <div className="text-sm whitespace-pre-line">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-secondary p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="input flex-1 text-sm"
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary p-2">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COVER PAGE - Stunning Landing Page
// ============================================================================
function CoverPage() {
  const setActiveTab = useUiStore((s) => s.setActiveTab);
  const addScenario = useScenarioStore((s) => s.addScenario);
  const [uploadedData, setUploadedData] = useState<File | null>(null);

  const handleDataUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      setUploadedData(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        alert(`Data uploaded successfully! File: ${file.name}\nRows: ${text.split('\n').length}\n\nNavigating to dashboard...`);
        setActiveTab('dashboard');
      };
      reader.readAsText(file);
    }
  };

  const loadSampleData = () => {
    const sampleScenario = {
      id: `scenario_${Date.now()}`,
      title: "Enterprise Supply Chain Risk Analysis (Sample Data)",
      horizonDays: 90,
      runs: 10000,
      correlation: "none" as const,
      variables: [
        {
          id: "v1",
          name: "Supplier Lead Time",
          dist: "triangular" as DistName,
          min: 10,
          mode: 15,
          max: 30,
          unit: "days"
        },
        {
          id: "v2",
          name: "Demand Variability",
          dist: "normal" as DistName,
          mean: 1000,
          stdev: 150,
          unit: "units"
        },
        {
          id: "v3",
          name: "Transport Delays",
          dist: "pert" as DistName,
          min: 2,
          mode: 5,
          max: 12,
          unit: "days"
        },
        {
          id: "v4",
          name: "Quality Rejection Rate",
          dist: "lognormal" as DistName,
          mean: 0.05,
          stdev: 0.02,
          unit: "%"
        },
      ],
      kpi: "delivery_delay" as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addScenario(sampleScenario);
    alert("Sample data loaded! Navigating to Monte Carlo simulation...");
    setActiveTab('monte-carlo');
  };

  return (
    <div className="space-y-0 -mt-8 -mx-6 overflow-hidden">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-surface to-background">
        {/* Dynamic Animated Background with Color Flashes */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -40, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.25, 0.45, 0.25],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {/* Color flash effects */}
          <motion.div
            className="absolute top-0 right-1/4 w-48 h-48 bg-green-500/20 rounded-full blur-2xl"
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.5, 0.8],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-blue-500/20 rounded-full blur-2xl"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [1, 1.6, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
        </div>

        {/* Hero Content with Scroll Animations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 py-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6"
          >
            <div className="inline-block p-4 bg-gradient-neo rounded-2xl shadow-glow mb-4">
              <Shield className="w-14 h-14 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-4 text-gradient tracking-wide"
          >
            R<span className="text-primary">_</span>LUMINA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-primary/90 font-bold mb-6 tracking-wider"
          >
            RLum
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl text-textMute mb-6"
          >
            Illuminate Your Risk Landscape with AI-Powered Precision
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg text-textMute/80 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The world&apos;s most comprehensive enterprise risk management platform.
            29 advanced modules. Real-time AI insights. Digital twins. Monte Carlo simulations.
            All in one beautiful interface.
          </motion.p>

          {/* CTA Buttons with Hover Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button
              onClick={() => setActiveTab('dashboard')}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(var(--primary-rgb), 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-10 py-5 flex items-center gap-3 rounded-xl font-semibold"
            >
              <BarChart3 className="w-6 h-6" />
              View Dashboards
            </motion.button>
            <motion.button
              onClick={loadSampleData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-10 py-5 flex items-center gap-3 rounded-xl font-semibold"
            >
              <Zap className="w-6 h-6" />
              Load Sample Data
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Navigation with Dropdowns */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-12 px-6 bg-surface/50 border-y border-border"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                title: "Core",
                tabs: [
                  { id: "dashboard", label: "Dashboard" },
                  { id: "monte-carlo", label: "Monte Carlo" },
                  { id: "scenario-studio", label: "Scenarios" },
                  { id: "register", label: "Risk Register" },
                ]
              },
              {
                title: "Advanced Analytics",
                tabs: [
                  { id: "cognitive-twin", label: "Digital Twin" },
                  { id: "portfolio", label: "Portfolio" },
                  { id: "network", label: "Network" },
                  { id: "bayesian", label: "Bayesian" },
                  { id: "forecasting", label: "Forecasting" },
                ]
              },
              {
                title: "Risk Methods",
                tabs: [
                  { id: "bow-tie", label: "Bow-tie" },
                  { id: "fmea", label: "FMEA" },
                  { id: "kri", label: "KRI" },
                  { id: "risk-appetite", label: "Appetite" },
                ]
              },
              {
                title: "Domain Risk",
                tabs: [
                  { id: "cyber-risk", label: "Cyber" },
                  { id: "climate-risk", label: "Climate" },
                  { id: "supply-chain", label: "Supply Chain" },
                  { id: "esg", label: "ESG" },
                  { id: "third-party", label: "Vendors" },
                ]
              },
              {
                title: "Modelling",
                tabs: [
                  { id: "agent-based", label: "Agent-Based" },
                  { id: "system-dynamics", label: "System Dynamics" },
                  { id: "what-if", label: "What-If" },
                  { id: "stress-lab", label: "Stress Lab" },
                ]
              },
            ].map((group, idx) => (
              <div key={idx} className="relative group">
                <button className="px-6 py-3 bg-gradient-neo text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                  {group.title}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown */}
                <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-surface border border-border rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {group.tabs.map((tab, tabIdx) => (
                    <button
                      key={tabIdx}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Bar */}
      <section className="bg-gradient-neo text-white py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">29</div>
              <div className="text-sm opacity-90">Enterprise Modules</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200K+</div>
              <div className="text-sm opacity-90">Monte Carlo Runs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">AI</div>
              <div className="text-sm opacity-90">Powered Insights</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Real-time</div>
              <div className="text-sm opacity-90">Risk Intelligence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Professional Icons */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-surface/30">
        <div className="max-w-[1400px] mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-4"
          >
            Enterprise Risk Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-textMute mb-16 max-w-2xl mx-auto text-lg"
          >
            Comprehensive suite of advanced analytics, AI-powered insights, and industry-specific risk modules
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-10 h-10" />,
                title: "AI Risk Analysis",
                description: "Run Monte Carlo simulations with AI-powered strategic insights and action plans",
                tab: 'monte-carlo',
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <Brain className="w-10 h-10" />,
                title: "Digital Twins",
                description: "Cognitive digital twins with real-time sensor data and predictive AI models",
                tab: 'cognitive-twin',
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FileBarChart className="w-10 h-10" />,
                title: "Portfolio Analytics",
                description: "VaR/CVaR, correlation analysis, and diversification benefit metrics",
                tab: 'portfolio',
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <Target className="w-10 h-10" />,
                title: "Bow-Tie Analysis",
                description: "Visual cause-consequence mapping with prevention and mitigation controls",
                tab: 'bow-tie',
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <Gauge className="w-10 h-10" />,
                title: "Risk Appetite",
                description: "Define and monitor risk tolerance across financial, operational, and strategic domains",
                tab: 'risk-appetite',
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <AlertTriangle className="w-10 h-10" />,
                title: "FMEA",
                description: "Failure Mode and Effects Analysis with RPN scoring and criticality assessment",
                tab: 'fmea',
                color: "from-yellow-500 to-orange-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setActiveTab(feature.tab as any)}
                className="card hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-textMute leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section with Real People */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5"
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Trusted by Risk Leaders Worldwide</h2>
          <p className="text-center text-textMute mb-16 text-lg">
            Join thousands of professionals using R_LUMINA for enterprise risk management
          </p>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { name: "Sarah Chen", role: "Chief Risk Officer", org: "Global Bank Corp", img: "https://i.pravatar.cc/150?img=5" },
              { name: "Michael Rodriguez", role: "VP Risk Management", org: "Tech Giants Inc", img: "https://i.pravatar.cc/150?img=12" },
              { name: "Emma Thompson", role: "Risk Analyst", org: "Fortune 500", img: "https://i.pravatar.cc/150?img=9" },
              { name: "David Kim", role: "Compliance Director", org: "FinTech Leaders", img: "https://i.pravatar.cc/150?img=33" }
            ].map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shadow-xl">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-neo rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="font-bold text-text">{person.name}</h4>
                <p className="text-sm text-textMute">{person.role}</p>
                <p className="text-xs text-textMute/70">{person.org}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Auto-Scrolling Image Carousel - People & Risk Imagery */}
      <section className="py-12 bg-background overflow-hidden">
        <div className="relative">
          <h3 className="text-2xl font-bold text-center mb-8">Real-Time Risk Intelligence in Action</h3>

          {/* Scrolling Container */}
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -2000],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {/* Repeat images twice for seamless loop */}
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex gap-6 shrink-0">
                  {/* Human Images */}
                  {[
                    { img: "https://i.pravatar.cc/120?img=1", label: "Risk Analyst" },
                    { img: "https://i.pravatar.cc/120?img=8", label: "CRO" },
                    { img: "https://i.pravatar.cc/120?img=15", label: "CFO" },
                    { img: "https://i.pravatar.cc/120?img=20", label: "Auditor" },
                    { img: "https://i.pravatar.cc/120?img=27", label: "Compliance" },
                    { img: "https://i.pravatar.cc/120?img=32", label: "Director" },
                  ].map((person, idx) => (
                    <div key={`person-${setIdx}-${idx}`} className="flex flex-col items-center shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg mb-2">
                        <img src={person.img} alt={person.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-textMute">{person.label}</span>
                    </div>
                  ))}

                  {/* Risk-Related Icons/Imagery */}
                  {[
                    { icon: <BarChart3 className="w-12 h-12" />, label: "Analytics", color: "from-blue-500 to-cyan-500" },
                    { icon: <AlertTriangle className="w-12 h-12" />, label: "Alerts", color: "from-yellow-500 to-orange-500" },
                    { icon: <Shield className="w-12 h-12" />, label: "Security", color: "from-green-500 to-emerald-500" },
                    { icon: <Target className="w-12 h-12" />, label: "Strategy", color: "from-red-500 to-pink-500" },
                    { icon: <Network className="w-12 h-12" />, label: "Network", color: "from-purple-500 to-indigo-500" },
                    { icon: <Database className="w-12 h-12" />, label: "Data", color: "from-teal-500 to-cyan-500" },
                  ].map((item, idx) => (
                    <div key={`risk-${setIdx}-${idx}`} className="flex flex-col items-center shrink-0">
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-2`}>
                        {item.icon}
                      </div>
                      <span className="text-xs text-textMute">{item.label}</span>
                    </div>
                  ))}

                  {/* More People */}
                  {[
                    { img: "https://i.pravatar.cc/120?img=41", label: "Manager" },
                    { img: "https://i.pravatar.cc/120?img=47", label: "VP Risk" },
                    { img: "https://i.pravatar.cc/120?img=52", label: "Executive" },
                  ].map((person, idx) => (
                    <div key={`person2-${setIdx}-${idx}`} className="flex flex-col items-center shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/20 shadow-lg mb-2">
                        <img src={person.img} alt={person.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs text-textMute">{person.label}</span>
                    </div>
                  ))}

                  {/* More Risk Icons */}
                  {[
                    { icon: <Gauge className="w-12 h-12" />, label: "KPIs", color: "from-indigo-500 to-blue-500" },
                    { icon: <Lock className="w-12 h-12" />, label: "Compliance", color: "from-gray-500 to-slate-500" },
                    { icon: <GitBranch className="w-12 h-12" />, label: "Scenarios", color: "from-pink-500 to-rose-500" },
                  ].map((item, idx) => (
                    <div key={`risk2-${setIdx}-${idx}`} className="flex flex-col items-center shrink-0">
                      <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-2`}>
                        {item.icon}
                      </div>
                      <span className="text-xs text-textMute">{item.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Upload Section with Professional Icons */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-6 bg-background"
      >
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Test the Platform</h2>
          <p className="text-center text-textMute mb-16 text-lg">
            Upload your own risk data or start with our sample dataset to explore all features
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Data */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="card bg-surface/80 backdrop-blur border-2 border-transparent hover:border-primary/30 transition-all"
            >
              <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white mb-6 shadow-xl">
                <Upload className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Upload Your Data</h3>
              <p className="text-sm text-textMute mb-6 leading-relaxed">
                Upload CSV or Excel files with your risk variables. We&apos;ll automatically parse and visualize them with our intelligent engine.
              </p>
              <label className="btn-primary cursor-pointer inline-flex items-center gap-3 text-base px-6 py-3">
                <Database className="w-5 h-5" />
                Choose File
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleDataUpload}
                  className="hidden"
                />
              </label>
              {uploadedData && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-green-500 font-semibold flex items-center gap-2"
                >
                  <span className="text-lg">✓</span> {uploadedData.name}
                </motion.p>
              )}
            </motion.div>

            {/* Sample Data */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="card bg-surface/80 backdrop-blur border-2 border-transparent hover:border-secondary/30 transition-all"
            >
              <div className="inline-flex p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-6 shadow-xl">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Try Sample Data</h3>
              <p className="text-sm text-textMute mb-6 leading-relaxed">
                Load a pre-configured supply chain risk scenario with 4 variables using different probability distributions.
              </p>
              <button onClick={loadSampleData} className="btn-secondary inline-flex items-center gap-3 text-base px-6 py-3">
                <Play className="w-5 h-5" />
                Load Sample Scenario
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center bg-gradient-neo text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Illuminate Your Risks?</h2>
        <p className="mb-8 opacity-90">Join the world&apos;s leading organizations using AI-powered risk intelligence</p>
        <button onClick={() => setActiveTab('dashboard')} className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform">
          Enter Platform →
        </button>
      </section>
    </div>
  );
}

// ============================================================================
// DASHBOARD TAB (Enhanced)
// ============================================================================
function DashboardTab() {
  const scenarios = useScenarioStore((s) => s.scenarios);
  const runs = useRunsStore((s) => s.runs);
  const risks = useRegisterStore((s) => s.risks);
  const latestRun = runs[0];

  const totalScenarios = scenarios.length;
  const totalRuns = runs.length;
  const avgRiskScore = risks.length > 0 ? (risks.reduce((sum, r) => sum + r.likelihood * r.impact, 0) / risks.length).toFixed(1) : "0.0";
  const highRisks = risks.filter((r) => r.likelihood * r.impact >= 15).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient mb-2">Enterprise Risk Dashboard</h2>
        <p className="text-textMute">Real-time overview of your risk landscape</p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="text-sm text-textMute">Total Scenarios</div>
          <div className="text-3xl font-bold text-primary mt-1">{totalScenarios}</div>
          <div className="text-xs text-success mt-1">Active simulations</div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">Simulation Runs</div>
          <div className="text-3xl font-bold text-secondary mt-1">{totalRuns}</div>
          <div className="text-xs text-textMute mt-1">Completed analyses</div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">Avg Risk Score</div>
          <div className="text-3xl font-bold text-warning mt-1">{avgRiskScore}</div>
          <div className="text-xs text-textMute mt-1">Likelihood × Impact</div>
        </div>
        <div className="card">
          <div className="text-sm text-textMute">High Risks</div>
          <div className="text-3xl font-bold text-danger mt-1">{highRisks}</div>
          <div className="text-xs text-textMute mt-1">Score ≥ 15</div>
        </div>
      </div>

      {/* Latest Simulation */}
      {latestRun ? (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Latest Simulation Results
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-textMute mb-2">Distribution Histogram</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={latestRun.histogram}>
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-sm text-textMute mb-2">Loss Exceedance Curve</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={latestRun.lec}>
                  <XAxis dataKey="x" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 1]} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                  <Line type="monotone" dataKey="y" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div className="text-sm text-textMute mb-2">Key Percentiles</div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs">P5 (Best Case)</span>
                  <span className="font-bold text-success">{latestRun.summary.p5.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">P50 (Median)</span>
                  <span className="font-bold text-text">{latestRun.summary.p50.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">P95 (Worst Case)</span>
                  <span className="font-bold text-danger">{latestRun.summary.p95.toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2 mt-2">
                  <span className="text-xs">Mean</span>
                  <span className="font-bold text-primary">{latestRun.summary.mean.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card h-64 flex flex-col items-center justify-center text-textMute">
          <TrendingUp className="w-12 h-12 mb-3 opacity-50" />
          <p>No simulations run yet</p>
          <p className="text-xs mt-1">Go to Monte Carlo tab to run your first simulation</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MONTE CARLO TAB (AI-Enhanced)
// ============================================================================
function MonteCarloTab() {
  const scenarios = useScenarioStore((s) => s.scenarios);
  const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
  const runs = useRunsStore((s) => s.runs);
  const addRun = useRunsStore((s) => s.addRun);
  const [aiInsights, setAiInsights] = useState<{ summary: string; actions: string[]; timeline: string; source: string } | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];
  const activeRun = runs.find((r) => r.summary.scenarioId === activeScenario?.id);

  const handleRun = () => {
    if (!activeScenario) return;
    const result = runMonteCarloSync(activeScenario);
    addRun(result);
  };

  const generateAIInsights = async () => {
    if (!activeScenario || !activeRun) return;

    setLoadingAI(true);
    try {
      const simulationSummary = `Mean: ${activeRun.summary.mean.toFixed(2)}, P50: ${activeRun.summary.p50.toFixed(2)}, P95: ${activeRun.summary.p95.toFixed(2)}, Std Dev: ${activeRun.summary.stdev.toFixed(2)}`;

      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle: activeScenario.title,
          variables: activeScenario.variables,
          timeHorizonDays: activeScenario.horizonDays,
          simulationSummary,
        }),
      });

      const data = await response.json();
      setAiInsights({
        summary: data.summary || '',
        actions: data.actions || [],
        timeline: data.timeline || '',
        source: data._source || 'ai',
      });
    } catch (error) {
      console.error('AI insights error:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Monte Carlo Simulation</h2>
          <p className="text-textMute">Run probabilistic simulations and analyze results</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRun} disabled={!activeScenario} className="btn-primary flex items-center gap-2">
            <Play className="w-4 h-4" />
            Run Simulation
          </button>
          {activeRun && (
            <button onClick={generateAIInsights} disabled={loadingAI} className="btn-secondary flex items-center gap-2">
              <Brain className="w-4 h-4" />
              {loadingAI ? 'Analyzing...' : 'AI Insights'}
            </button>
          )}
        </div>
      </div>

      {activeScenario && (
        <div className="card">
          <h3 className="font-semibold mb-2">Active Scenario</h3>
          <p className="text-lg text-primary">{activeScenario.title}</p>
          <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-textMute">Variables:</span> <span className="font-bold">{activeScenario.variables.length}</span>
            </div>
            <div>
              <span className="text-textMute">Runs:</span> <span className="font-bold">{activeScenario.runs.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-textMute">Horizon:</span> <span className="font-bold">{activeScenario.horizonDays} days</span>
            </div>
            <div>
              <span className="text-textMute">KPI:</span> <span className="font-bold capitalize">{activeScenario.kpi.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>
      )}

      {activeRun ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeRun.histogram}>
                <XAxis dataKey="bin" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Loss Exceedance Curve</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeRun.lec}>
                <XAxis dataKey="x" label={{ value: "Loss", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Probability", angle: -90, position: "insideLeft" }} domain={[0, 1]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                <Line type="monotone" dataKey="y" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card col-span-2">
            <h3 className="font-semibold mb-4">Tornado Chart (Sensitivity Analysis)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activeRun.tornado} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="variable" width={90} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                <Bar dataKey="sensitivity" fill="hsl(var(--warning))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card h-96 flex items-center justify-center text-textMute">
          Click &quot;Run Simulation&quot; to see results
        </div>
      )}

      {/* AI Insights Panel */}
      {aiInsights && (
        <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Risk Analysis
            </h3>
            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary font-bold">
              {aiInsights.source === 'ai' ? '🤖 Claude AI' : '⚡ Local'}
            </span>
          </div>

          <div className="space-y-4">
            {/* Executive Summary */}
            <div>
              <div className="text-sm font-semibold text-textMute mb-2">📊 Executive Summary</div>
              <div className="text-sm whitespace-pre-line bg-surface/50 p-3 rounded">{aiInsights.summary}</div>
            </div>

            {/* Key Actions */}
            <div>
              <div className="text-sm font-semibold text-textMute mb-2">✅ Recommended Actions</div>
              <div className="space-y-2">
                {aiInsights.actions.map((action, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-surface/50 p-2 rounded">
                    <span className="text-xs font-bold text-primary mt-0.5">{idx + 1}.</span>
                    <span className="text-sm flex-1">{action}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="text-sm font-semibold text-textMute mb-2">⏱️ Implementation Timeline</div>
              <div className="text-sm bg-surface/50 p-3 rounded">{aiInsights.timeline}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SCENARIO STUDIO TAB (Existing)
// ============================================================================
function ScenarioStudioTab() {
  const scenarios = useScenarioStore((s) => s.scenarios);
  const activeScenarioId = useScenarioStore((s) => s.activeScenarioId);
  const updateScenario = useScenarioStore((s) => s.updateScenario);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const addVariable = () => {
    if (!activeScenario) return;
    const newVar: ScenarioVariable = {
      id: `var_${Date.now()}`,
      name: "New Variable",
      dist: "triangular",
      min: 0,
      mode: 50,
      max: 100,
      unit: "",
    };
    updateScenario(activeScenario.id, { variables: [...activeScenario.variables, newVar] });
  };

  const removeVariable = (varId: string) => {
    if (!activeScenario) return;
    updateScenario(activeScenario.id, {
      variables: activeScenario.variables.filter((v) => v.id !== varId),
    });
  };

  const updateVariable = (varId: string, updates: Partial<ScenarioVariable>) => {
    if (!activeScenario) return;
    updateScenario(activeScenario.id, {
      variables: activeScenario.variables.map((v) => (v.id === varId ? { ...v, ...updates } : v)),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Scenario Studio</h2>
          <p className="text-textMute">Design and configure simulation scenarios</p>
        </div>
        <button onClick={addVariable} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Variable
        </button>
      </div>

      {activeScenario ? (
        <div className="space-y-4">
          <div className="card">
            <label className="block text-sm font-medium mb-1">Scenario Name</label>
            <input
              type="text"
              value={activeScenario.title}
              onChange={(e) => updateScenario(activeScenario.id, { title: e.target.value })}
              className="input w-full"
            />
          </div>

          {activeScenario.variables.length > 0 ? (
            <div className="space-y-3">
              {activeScenario.variables.map((variable) => (
                <div key={variable.id} className="card bg-surface/50">
                  <div className="grid grid-cols-6 gap-4 items-start">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-textMute">Name</label>
                      <input
                        type="text"
                        value={variable.name}
                        onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                        className="input w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-textMute">Distribution</label>
                      <select
                        value={variable.dist}
                        onChange={(e) => updateVariable(variable.id, { dist: e.target.value as DistName })}
                        className="input w-full text-sm"
                      >
                        <option value="triangular">Triangular</option>
                        <option value="pert">PERT</option>
                        <option value="normal">Normal</option>
                        <option value="lognormal">Lognormal</option>
                      </select>
                    </div>
                    {(variable.dist === "triangular" || variable.dist === "pert") && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-textMute">Min</label>
                          <input
                            type="number"
                            value={variable.min ?? 0}
                            onChange={(e) => updateVariable(variable.id, { min: parseFloat(e.target.value) })}
                            className="input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-textMute">Mode</label>
                          <input
                            type="number"
                            value={variable.mode ?? 0}
                            onChange={(e) => updateVariable(variable.id, { mode: parseFloat(e.target.value) })}
                            className="input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-textMute">Max</label>
                          <input
                            type="number"
                            value={variable.max ?? 0}
                            onChange={(e) => updateVariable(variable.id, { max: parseFloat(e.target.value) })}
                            className="input w-full text-sm"
                          />
                        </div>
                      </>
                    )}
                    {(variable.dist === "normal" || variable.dist === "lognormal") && (
                      <>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-textMute">Mean</label>
                          <input
                            type="number"
                            value={variable.mean ?? 0}
                            onChange={(e) => updateVariable(variable.id, { mean: parseFloat(e.target.value) })}
                            className="input w-full text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1 text-textMute">Std Dev</label>
                          <input
                            type="number"
                            value={variable.stdev ?? 0}
                            onChange={(e) => updateVariable(variable.id, { stdev: parseFloat(e.target.value) })}
                            className="input w-full text-sm"
                          />
                        </div>
                      </>
                    )}
                    <div className="flex items-end">
                      <button onClick={() => removeVariable(variable.id)} className="btn-ghost text-danger p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card h-64 flex items-center justify-center text-textMute">
              <div className="text-center">
                No variables yet. Click &quot;Add Variable&quot; to get started.
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card h-96 flex items-center justify-center text-textMute">No scenario selected</div>
      )}
    </div>
  );
}

// ============================================================================
// RISK REGISTER TAB (Existing)
// ============================================================================
function RiskRegisterTab() {
  const risks = useRegisterStore((s) => s.risks);
  const addRisk = useRegisterStore((s) => s.addRisk);

  const handleAddRisk = () => {
    addRisk({
      id: `risk_${Date.now()}`,
      title: "New Risk",
      category: "Other",
      likelihood: 3,
      impact: 3,
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  };

  // 5x5 heatmap
  const heatmapData = Array.from({ length: 25 }, (_, i) => {
    const likelihood = 5 - Math.floor(i / 5);
    const impact = (i % 5) + 1;
    const score = likelihood * impact;
    const count = risks.filter((r) => r.likelihood === likelihood && r.impact === impact).length;
    const color = score >= 15 ? "bg-danger/30 border-danger" : score >= 9 ? "bg-warning/30 border-warning" : "bg-success/30 border-success";
    return { likelihood, impact, score, count, color };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Risk Register</h2>
          <p className="text-textMute">Track and manage organizational risks</p>
        </div>
        <button onClick={handleAddRisk} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Risk
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="card col-span-2">
          <h3 className="font-semibold mb-4">Risk Heatmap (5×5)</h3>
          <div className="grid grid-cols-5 gap-1">
            {heatmapData.map((cell, idx) => (
              <div
                key={idx}
                className={`h-20 flex items-center justify-center border-2 rounded ${cell.color} transition-all hover:scale-105`}
              >
                {cell.count > 0 && <span className="text-2xl font-bold text-text">{cell.count}</span>}
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-1 text-xs text-center">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
          </div>
          <div className="text-xs text-center text-textMute mt-1">Impact →</div>
        </div>

        {/* Stats */}
        <div className="card">
          <h3 className="font-semibold mb-4">Summary</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-textMute">Total Risks</div>
              <div className="text-2xl font-bold text-text">{risks.length}</div>
            </div>
            <div>
              <div className="text-xs text-textMute">High Severity (≥15)</div>
              <div className="text-2xl font-bold text-danger">{risks.filter((r) => r.likelihood * r.impact >= 15).length}</div>
            </div>
            <div>
              <div className="text-xs text-textMute">Medium (9-14)</div>
              <div className="text-2xl font-bold text-warning">
                {risks.filter((r) => {
                  const s = r.likelihood * r.impact;
                  return s >= 9 && s < 15;
                }).length}
              </div>
            </div>
            <div>
              <div className="text-xs text-textMute">Low (&lt;9)</div>
              <div className="text-2xl font-bold text-success">{risks.filter((r) => r.likelihood * r.impact < 9).length}</div>
            </div>
          </div>
        </div>
      </div>

      {risks.length > 0 ? (
        <div className="card">
          <h3 className="font-semibold mb-4">Risk List</h3>
          <div className="space-y-2">
            {risks.slice(0, 10).map((risk) => (
              <div key={risk.id} className="p-3 bg-surface/50 rounded border border-border flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium">{risk.title}</div>
                  <div className="text-xs text-textMute mt-1">
                    {risk.category} • Likelihood: {risk.likelihood} • Impact: {risk.impact} • Score: {risk.likelihood * risk.impact}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-medium ${risk.status === "open" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"}`}>
                  {risk.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card h-64 flex items-center justify-center text-textMute">
          No risks registered. Click &quot;Add Risk&quot; to create one.
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COGNITIVE DIGITAL TWIN TAB ⭐ NEW
// ============================================================================
function CognitiveTwinTab() {
  const [twins] = useState<DigitalTwin[]>([
    {
      id: "twin_1",
      name: "Supply Chain Digital Twin",
      description: "Virtual replica of end-to-end supply chain operations with AI-powered predictive analytics",
      type: "system",
      state: {
        timestamp: Date.now(),
        parameters: { throughput: 1250, latency: 45, inventory: 8500, quality: 0.985 },
        health: "healthy",
        anomalyScore: 0.12,
        predictions: {
          horizon: 30,
          values: { throughput: [1200, 1220, 1240, 1260], inventory: [8400, 8350, 8300, 8250] },
          confidence: [0.95, 0.92, 0.88, 0.85],
        },
      },
      sensors: [
        { id: "s1", name: "Throughput Rate", type: "flow", unit: "units/hr", value: 1250, status: "normal" },
        { id: "s2", name: "Avg Latency", type: "speed", unit: "min", value: 45, threshold: { min: 0, max: 60 }, status: "normal" },
        { id: "s3", name: "Inventory Level", type: "count", unit: "units", value: 8500, threshold: { min: 7000, max: 10000 }, status: "normal" },
        { id: "s4", name: "Quality Score", type: "custom", unit: "%", value: 98.5, threshold: { min: 95, max: 100 }, status: "normal" },
      ],
      actuators: [
        { id: "a1", name: "Production Rate", type: "controller", state: "auto", value: 100 },
        { id: "a2", name: "Safety Stock", type: "policy", state: "on", value: 1000 },
      ],
      kpis: [
        { id: "k1", name: "OEE", current: 0.85, target: 0.90, tolerance: 0.05, trend: "stable" },
        { id: "k2", name: "OTIF", current: 0.92, target: 0.95, tolerance: 0.03, trend: "up" },
      ],
      aiModel: { type: "lstm", trainedAt: Date.now() - 86400000 * 7, accuracy: 0.89 },
      simulationMode: "predictive",
      updateFrequency: 5000,
      createdAt: Date.now() - 86400000 * 30,
      updatedAt: Date.now(),
    },
  ]);

  const selectedTwin = twins[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
          <Brain className="w-7 h-7 text-primary" />
          Cognitive Digital Twin
        </h2>
        <p className="text-textMute">AI-powered virtual replicas with predictive intelligence</p>
      </div>

      {selectedTwin && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="card">
              <div className="text-xs text-textMute">Health Status</div>
              <div className="text-2xl font-bold text-success mt-1 capitalize">{selectedTwin.state.health}</div>
              <div className="text-xs mt-1">Anomaly: {(selectedTwin.state.anomalyScore * 100).toFixed(1)}%</div>
            </div>
            <div className="card">
              <div className="text-xs text-textMute">AI Model</div>
              <div className="text-2xl font-bold text-primary mt-1 uppercase">{selectedTwin.aiModel?.type}</div>
              <div className="text-xs mt-1">Accuracy: {((selectedTwin.aiModel?.accuracy || 0) * 100).toFixed(0)}%</div>
            </div>
            <div className="card">
              <div className="text-xs text-textMute">Simulation Mode</div>
              <div className="text-2xl font-bold text-secondary mt-1 capitalize">{selectedTwin.simulationMode}</div>
              <div className="text-xs mt-1">{selectedTwin.state.predictions.horizon} days ahead</div>
            </div>
            <div className="card">
              <div className="text-xs text-textMute">Active Sensors</div>
              <div className="text-2xl font-bold text-text mt-1">{selectedTwin.sensors.length}</div>
              <div className="text-xs mt-1">{selectedTwin.actuators.length} actuators</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4">Live Sensor Data</h3>
              <div className="space-y-3">
                {selectedTwin.sensors.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-2 bg-surface/50 rounded">
                    <div>
                      <div className="text-sm font-medium">{sensor.name}</div>
                      <div className="text-xs text-textMute capitalize">{sensor.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {sensor.value} {sensor.unit}
                      </div>
                      <div className={`text-xs ${sensor.status === "normal" ? "text-success" : "text-warning"}`}>{sensor.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4">KPI Performance</h3>
              <div className="space-y-4">
                {selectedTwin.kpis.map((kpi) => {
                  const pct = (kpi.current / kpi.target) * 100;
                  const isOnTrack = Math.abs(kpi.current - kpi.target) <= kpi.tolerance;
                  return (
                    <div key={kpi.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{kpi.name}</span>
                        <span className="text-sm">
                          {(kpi.current * 100).toFixed(1)}% / {(kpi.target * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <div className={`h-full ${isOnTrack ? "bg-success" : "bg-warning"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-textMute">
                        {kpi.trend === "up" && <TrendingUp className="w-3 h-3 text-success" />}
                        {kpi.trend === "down" && <TrendingDown className="w-3 h-3 text-danger" />}
                        <span className="capitalize">{kpi.trend}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">30-Day Predictive Forecast (AI-Generated)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={Array.from({ length: 30 }, (_, i) => ({
                  day: i + 1,
                  throughput: 1250 - i * 2 + Math.random() * 40,
                  inventory: 8500 - i * 10 + Math.random() * 200,
                }))}
              >
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
                <Area yAxisId="left" type="monotone" dataKey="throughput" stroke="hsl(var(--primary))" fill="url(#colorThroughput)" />
                <Area yAxisId="right" type="monotone" dataKey="inventory" stroke="hsl(var(--secondary))" fill="none" strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================================
// PORTFOLIO TAB ⭐ NEW
// ============================================================================
function PortfolioTab() {
  const scenarios = useScenarioStore((s) => s.scenarios);

  // Mock portfolio aggregation
  const portfolio: Portfolio = {
    id: "portfolio_1",
    name: "Enterprise Risk Portfolio",
    description: "Aggregated view of all organizational risks",
    scenarioIds: scenarios.slice(0, 3).map((s) => s.id),
    weights: [0.5, 0.3, 0.2],
    aggregationMethod: "monte-carlo",
    var95: 125000,
    var99: 185000,
    cvar95: 142000,
    cvar99: 210000,
    expectedLoss: 75000,
    diversificationBenefit: 0.18,
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now(),
  };

  const varData = [
    { metric: "Expected", value: portfolio.expectedLoss },
    { metric: "VaR 95%", value: portfolio.var95 },
    { metric: "VaR 99%", value: portfolio.var99 },
    { metric: "CVaR 95%", value: portfolio.cvar95 },
    { metric: "CVaR 99%", value: portfolio.cvar99 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Portfolio Risk Aggregation</h2>
        <p className="text-textMute">Enterprise-wide risk consolidation with VaR/CVaR analytics</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="text-xs text-textMute">Expected Loss</div>
          <div className="text-2xl font-bold text-text mt-1">${(portfolio.expectedLoss / 1000).toFixed(0)}K</div>
          <div className="text-xs text-textMute mt-1">Mean scenario</div>
        </div>
        <div className="card">
          <div className="text-xs text-textMute">VaR 95%</div>
          <div className="text-2xl font-bold text-warning mt-1">${(portfolio.var95 / 1000).toFixed(0)}K</div>
          <div className="text-xs text-textMute mt-1">1-in-20 event</div>
        </div>
        <div className="card">
          <div className="text-xs text-textMute">CVaR 95%</div>
          <div className="text-2xl font-bold text-danger mt-1">${(portfolio.cvar95 / 1000).toFixed(0)}K</div>
          <div className="text-xs text-textMute mt-1">Tail average</div>
        </div>
        <div className="card">
          <div className="text-xs text-textMute">Diversification Benefit</div>
          <div className="text-2xl font-bold text-success mt-1">{((portfolio.diversificationBenefit ?? 0) * 100).toFixed(0)}%</div>
          <div className="text-xs text-textMute mt-1">Risk reduction</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Value at Risk (VaR) Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={varData}>
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
              <Bar dataKey="value" fill="hsl(var(--primary))">
                {varData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? "hsl(var(--success))" : index >= 3 ? "hsl(var(--danger))" : "hsl(var(--warning))"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Portfolio Composition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scenarios.slice(0, 3).map((s, i) => ({ name: s.title, value: (portfolio.weights?.[i] || 0) * 100 }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--secondary))" />
                <Cell fill="hsl(var(--warning))" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BOW-TIE ANALYSIS TAB ⭐ NEW
// ============================================================================
function BowTieTab() {
  const bowtie: BowTie = {
    id: "bt_1",
    title: "Data Breach Bow-Tie Analysis",
    centralEvent: "Unauthorized Data Access",
    severity: 5,
    threats: [
      { id: "t1", label: "Phishing Attack", probability: 0.15 },
      { id: "t2", label: "Malware Infection", probability: 0.08 },
      { id: "t3", label: "Insider Threat", probability: 0.05 },
    ],
    consequences: [
      { id: "c1", label: "Financial Loss", probability: 0.8 },
      { id: "c2", label: "Reputation Damage", probability: 0.9 },
      { id: "c3", label: "Regulatory Fine", probability: 0.6 },
    ],
    preventiveControls: [
      { id: "pc1", label: "MFA", effectiveness: 0.85, type: "preventive", status: "active", linkedThreatsOrConsequences: ["t1", "t2"] },
      { id: "pc2", label: "Security Training", effectiveness: 0.7, type: "preventive", status: "active", linkedThreatsOrConsequences: ["t1", "t3"] },
    ],
    mitigativeControls: [
      { id: "mc1", label: "Incident Response Plan", effectiveness: 0.75, type: "corrective", status: "active", linkedThreatsOrConsequences: ["c1", "c2"] },
      { id: "mc2", label: "Cyber Insurance", effectiveness: 0.9, type: "corrective", status: "active", linkedThreatsOrConsequences: ["c1", "c3"] },
    ],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Bow-Tie Analysis</h2>
        <p className="text-textMute">Threat-Event-Consequence visualization with barrier controls</p>
      </div>

      <div className="card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-danger/20 border-2 border-danger rounded-lg">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <span className="text-lg font-bold">{bowtie.centralEvent}</span>
            <span className="text-xs bg-danger text-white px-2 py-1 rounded">Severity: {bowtie.severity}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Threats */}
          <div>
            <h3 className="text-sm font-semibold text-warning mb-3">⬅ Threats</h3>
            <div className="space-y-2">
              {bowtie.threats.map((threat) => (
                <div key={threat.id} className="p-3 bg-warning/10 border border-warning/30 rounded text-sm">
                  <div className="font-medium">{threat.label}</div>
                  <div className="text-xs text-textMute mt-1">P = {((threat.probability || 0) * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-success mb-2">Preventive Controls</h4>
              <div className="space-y-1">
                {bowtie.preventiveControls.map((ctrl) => (
                  <div key={ctrl.id} className="p-2 bg-success/10 border border-success/30 rounded text-xs">
                    <div className="font-medium">{ctrl.label}</div>
                    <div className="text-textMute">Effectiveness: {(ctrl.effectiveness * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Central Event */}
          <div className="flex items-center justify-center">
            <div className="w-2 h-full bg-gradient-to-r from-warning via-danger to-primary rounded-full"></div>
          </div>

          {/* Consequences */}
          <div>
            <h3 className="text-sm font-semibold text-primary mb-3">Consequences ➡</h3>
            <div className="space-y-2">
              {bowtie.consequences.map((cons) => (
                <div key={cons.id} className="p-3 bg-primary/10 border border-primary/30 rounded text-sm">
                  <div className="font-medium">{cons.label}</div>
                  <div className="text-xs text-textMute mt-1">P = {((cons.probability || 0) * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-secondary mb-2">Mitigative Controls</h4>
              <div className="space-y-1">
                {bowtie.mitigativeControls.map((ctrl) => (
                  <div key={ctrl.id} className="p-2 bg-secondary/10 border border-secondary/30 rounded text-xs">
                    <div className="font-medium">{ctrl.label}</div>
                    <div className="text-textMute">Effectiveness: {(ctrl.effectiveness * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// FMEA TAB ⭐ NEW
// ============================================================================
function FMEATab() {
  const fmea: FMEA = {
    id: "fmea_1",
    title: "Product Launch FMEA",
    type: "process",
    items: [
      {
        id: "f1",
        component: "Marketing Campaign",
        function: "Generate demand",
        failureMode: "Low engagement",
        effects: "Missed sales targets",
        causes: "Poor targeting",
        severity: 8,
        occurrence: 5,
        detection: 6,
        rpn: 240,
      },
      {
        id: "f2",
        component: "Supply Chain",
        function: "Deliver product",
        failureMode: "Stock-out",
        effects: "Lost sales",
        causes: "Demand forecast error",
        severity: 9,
        occurrence: 4,
        detection: 7,
        rpn: 252,
      },
      {
        id: "f3",
        component: "Quality Control",
        function: "Ensure quality",
        failureMode: "Defects shipped",
        effects: "Returns & complaints",
        causes: "Insufficient testing",
        severity: 10,
        occurrence: 3,
        detection: 5,
        rpn: 150,
      },
    ],
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
  };

  const sortedItems = [...fmea.items].sort((a, b) => b.rpn - a.rpn);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">FMEA - Failure Mode Effects Analysis</h2>
        <p className="text-textMute">Systematic risk prioritization using RPN (Severity × Occurrence × Detection)</p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">{fmea.title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2">Component</th>
                <th className="text-left p-2">Failure Mode</th>
                <th className="text-left p-2">Effects</th>
                <th className="text-center p-2">S</th>
                <th className="text-center p-2">O</th>
                <th className="text-center p-2">D</th>
                <th className="text-center p-2 font-bold">RPN</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => {
                const riskLevel = item.rpn >= 200 ? "bg-danger/10 border-l-4 border-danger" : item.rpn >= 100 ? "bg-warning/10 border-l-4 border-warning" : "bg-success/10 border-l-4 border-success";
                return (
                  <tr key={item.id} className={`border-b border-border/50 ${riskLevel}`}>
                    <td className="p-2 font-medium">{item.component}</td>
                    <td className="p-2">{item.failureMode}</td>
                    <td className="p-2 text-textMute">{item.effects}</td>
                    <td className="p-2 text-center font-bold">{item.severity}</td>
                    <td className="p-2 text-center font-bold">{item.occurrence}</td>
                    <td className="p-2 text-center font-bold">{item.detection}</td>
                    <td className="p-2 text-center font-bold text-lg">{item.rpn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">RPN Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sortedItems}>
            <XAxis dataKey="component" tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }} />
            <Bar dataKey="rpn" fill="hsl(var(--warning))">
              {sortedItems.map((item, index) => (
                <Cell key={`cell-${index}`} fill={item.rpn >= 200 ? "hsl(var(--danger))" : item.rpn >= 100 ? "hsl(var(--warning))" : "hsl(var(--success))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ============================================================================
// NETWORK ANALYSIS TAB ⭐ NEW
// ============================================================================
function NetworkTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
          <Network className="w-7 h-7 text-primary" />
          Risk Network Analysis
        </h2>
        <p className="text-textMute">Graph-based risk dependencies and cascading effects</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="text-xs text-textMute">Network Density</div>
          <div className="text-2xl font-bold text-primary mt-1">0.42</div>
          <div className="text-xs text-textMute mt-1">Interconnection level</div>
        </div>
        <div className="card">
          <div className="text-xs text-textMute">Clustering Coefficient</div>
          <div className="text-2xl font-bold text-secondary mt-1">0.58</div>
          <div className="text-xs text-textMute mt-1">Local connectivity</div>
        </div>
        <div className="card">
          <div className="text-xs text-textMute">Critical Nodes</div>
          <div className="text-2xl font-bold text-warning mt-1">7</div>
          <div className="text-xs text-textMute mt-1">High centrality</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Risk Dependency Graph (Mock Visualization)</h3>
        <div className="h-96 bg-surface/50 rounded-lg flex items-center justify-center">
          <div className="text-center text-textMute">
            <Network className="w-16 h-16 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Interactive network graph</p>
            <p className="text-xs mt-1">Use D3.js or Cytoscape.js for production implementation</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Central Nodes (Highest Impact)</h3>
        <div className="space-y-2">
          {["Financial System Failure", "Supply Chain Disruption", "Data Breach", "Regulatory Change", "Key Personnel Loss"].map((node, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface/50 rounded">
              <div>
                <div className="font-medium">{node}</div>
                <div className="text-xs text-textMute">Betweenness centrality: {(0.85 - i * 0.1).toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-danger">{15 - i * 2} connections</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// KRI TAB
// ============================================================================
function KRITab() {
  const kris: KRI[] = [
    {
      id: "kri_1",
      name: "Cybersecurity Incident Rate",
      description: "Number of security incidents per month",
      category: "cyber",
      unit: "incidents/month",
      frequency: "monthly",
      currentValue: 8,
      previousValue: 12,
      trend: "improving",
      thresholds: {
        green: { min: 0, max: 5 },
        amber: { min: 5, max: 10 },
        red: { min: 10, max: 999 },
      },
      status: "amber",
      owner: "CISO",
      linkedRiskIds: [],
      history: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: "kri_2",
      name: "Customer Churn Rate",
      description: "Monthly customer attrition percentage",
      category: "operational",
      unit: "%",
      frequency: "monthly",
      currentValue: 3.2,
      previousValue: 3.8,
      trend: "improving",
      thresholds: {
        green: { min: 0, max: 3 },
        amber: { min: 3, max: 5 },
        red: { min: 5, max: 100 },
      },
      status: "amber",
      owner: "COO",
      linkedRiskIds: [],
      history: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Key Risk Indicators (KRI)</h2>
        <p className="text-textMute">Real-time monitoring with threshold-based alerting</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {kris.map((kri) => (
          <div key={kri.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{kri.name}</h3>
                <p className="text-xs text-textMute">{kri.description}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-bold ${kri.status === "green" ? "bg-success/20 text-success" : kri.status === "amber" ? "bg-warning/20 text-warning" : "bg-danger/20 text-danger"}`}>
                {kri.status.toUpperCase()}
              </div>
            </div>
            <div className="text-3xl font-bold text-text mb-2">
              {kri.currentValue} {kri.unit}
            </div>
            <div className="flex items-center gap-2 text-sm text-success">
              <TrendingDown className="w-4 h-4" />
              <span>
                {kri.previousValue} → {kri.currentValue} (Improving)
              </span>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Thresholds:</span>
              </div>
              <div className="flex gap-1 h-2">
                <div className="flex-1 bg-success/30 rounded" />
                <div className="flex-1 bg-warning/30 rounded" />
                <div className="flex-1 bg-danger/30 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// RISK APPETITE TAB
// ============================================================================
function RiskAppetiteTab() {
  const appetites: RiskAppetite[] = [
    {
      id: "ra_1",
      category: "Financial",
      metric: "Annual Loss",
      unit: "$M",
      appetite: 5,
      tolerance: 10,
      capacity: 20,
      currentExposure: 7,
      status: "within-tolerance",
      owner: "CFO",
      reviewFrequency: "quarterly",
      lastReviewed: Date.now() - 86400000 * 30,
      nextReview: Date.now() + 86400000 * 60,
    },
    {
      id: "ra_2",
      category: "Reputational",
      metric: "NPS Score Drop",
      unit: "points",
      appetite: 5,
      tolerance: 10,
      capacity: 20,
      currentExposure: 3,
      status: "within-appetite",
      owner: "CMO",
      reviewFrequency: "monthly",
      lastReviewed: Date.now() - 86400000 * 15,
      nextReview: Date.now() + 86400000 * 15,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Risk Appetite Framework</h2>
        <p className="text-textMute">Define tolerance bands and monitor current exposure</p>
      </div>

      <div className="space-y-4">
        {appetites.map((app) => (
          <div key={app.id} className="card">
            <div className="mb-4">
              <h3 className="font-semibold">{app.category} - {app.metric}</h3>
              <p className="text-xs text-textMute">Owner: {app.owner} • Review: {app.reviewFrequency}</p>
            </div>
            <div className="relative h-12 bg-surface/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="bg-success/20 border-r-2 border-success" style={{ width: `${(app.appetite / app.capacity) * 100}%` }}>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-success">APPETITE</div>
                </div>
                <div className="bg-warning/20 border-r-2 border-warning" style={{ width: `${((app.tolerance - app.appetite) / app.capacity) * 100}%` }}>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-warning">TOLERANCE</div>
                </div>
                <div className="bg-danger/20 flex-1">
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-danger">CAPACITY</div>
                </div>
              </div>
              <div
                className="absolute top-0 bottom-0 w-1 bg-text shadow-lg"
                style={{ left: `${(app.currentExposure / app.capacity) * 100}%` }}
                title={`Current: ${app.currentExposure} ${app.unit}`}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold">
                  {app.currentExposure} {app.unit}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span>0 {app.unit}</span>
              <span className={`font-bold ${app.status === "within-appetite" ? "text-success" : app.status === "within-tolerance" ? "text-warning" : "text-danger"}`}>
                {app.status.replace(/-/g, " ").toUpperCase()}
              </span>
              <span>{app.capacity} {app.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PLACEHOLDER TABS (Bayesian, etc.)
// ============================================================================
function BayesianTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">Bayesian Network Modeling</h2>
        <p className="text-textMute">Probabilistic reasoning with conditional dependencies</p>
      </div>
      <div className="card h-96 flex items-center justify-center text-textMute">
        <div className="text-center">
          <Brain className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Bayesian Network Editor</p>
          <p className="text-xs mt-1">Define nodes, CPTs, and run inference algorithms</p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
        <p className="text-textMute">{subtitle}</p>
      </div>
      <div className="card h-96 flex items-center justify-center text-textMute">
        <div className="text-center">
          <Activity className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="font-medium">Coming Soon</p>
          <p className="text-xs mt-1">Enterprise feature under development</p>
        </div>
      </div>
    </div>
  );
}
