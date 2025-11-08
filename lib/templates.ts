// lib/templates.ts - Pre-built scenario templates for common SME risks

import type { Template, TemplateType } from "@/app/types";
import { generateId } from "./utils";

export const TEMPLATES: Template[] = [
  {
    id: "tmpl-supply-chain",
    type: "supply_chain_delay",
    name: "Supply Chain Disruption",
    description: "Model supplier delays, port congestion, and inventory stockouts",
    icon: "📦",
    scenario: {
      title: "Supply Chain Delay Analysis",
      description:
        "Assess impact of supplier delays on inventory and customer fulfillment",
      timeHorizonDays: 30,
      nRuns: 10000,
      volatility: 1.0,
      correlationType: "pearson",
      primaryKPI: "days_out_of_stock",
      variables: [
        {
          id: generateId(),
          name: "Supplier Delay (days)",
          unit: "days",
          distribution: "pert",
          min: 7,
          mostLikely: 14,
          max: 30,
          lambda: 4,
        },
        {
          id: generateId(),
          name: "Current Stock Coverage (days)",
          unit: "days",
          distribution: "triangular",
          min: 8,
          mostLikely: 12,
          max: 18,
        },
        {
          id: generateId(),
          name: "Daily Demand Variability",
          unit: "units",
          distribution: "normal",
          mean: 100,
          stdDev: 20,
        },
      ],
    },
    riskSeeds: [
      {
        title: "Supplier Bankruptcy",
        category: "operational",
        description: "Primary supplier faces financial distress",
        likelihood: 2,
        impact: 5,
        mitigation: "Identify and qualify backup suppliers within 7 days",
        status: "open",
      },
    ],
  },

  {
    id: "tmpl-payment-outage",
    type: "payment_outage",
    name: "Payment Processor Outage",
    description: "Analyze revenue impact from payment system downtime",
    icon: "💳",
    scenario: {
      title: "Payment System Downtime Impact",
      description: "Quantify lost revenue and customer churn from payment outages",
      timeHorizonDays: 1,
      nRuns: 10000,
      volatility: 1.0,
      correlationType: "none",
      primaryKPI: "cost_overrun",
      variables: [
        {
          id: generateId(),
          name: "Outage Duration (minutes)",
          unit: "minutes",
          distribution: "lognormal",
          mean: 4.0, // log(60) ≈ 4
          stdDev: 0.8,
        },
        {
          id: generateId(),
          name: "Checkout Attempts per Minute",
          unit: "checkouts",
          distribution: "normal",
          mean: 50,
          stdDev: 15,
        },
        {
          id: generateId(),
          name: "Average Order Value",
          unit: "USD",
          distribution: "triangular",
          min: 30,
          mostLikely: 75,
          max: 200,
        },
      ],
    },
    riskSeeds: [
      {
        title: "Payment Provider SLA Breach",
        category: "operational",
        description: "Exceeds monthly downtime allowance",
        likelihood: 3,
        impact: 4,
        mitigation: "Implement backup payment gateway within 48 hours",
        status: "open",
      },
    ],
  },

  {
    id: "tmpl-regulatory",
    type: "regulatory_change",
    name: "Regulatory Compliance Change",
    description: "Model cost and timeline for new regulation compliance",
    icon: "⚖️",
    scenario: {
      title: "New Regulation Compliance",
      description: "Estimate implementation cost and time for regulatory changes",
      timeHorizonDays: 180,
      nRuns: 5000,
      volatility: 1.2,
      correlationType: "pearson",
      primaryKPI: "cost_overrun",
      variables: [
        {
          id: generateId(),
          name: "Legal Review Time (days)",
          unit: "days",
          distribution: "pert",
          min: 10,
          mostLikely: 20,
          max: 45,
          lambda: 4,
        },
        {
          id: generateId(),
          name: "Implementation Cost (USD)",
          unit: "USD",
          distribution: "triangular",
          min: 25000,
          mostLikely: 75000,
          max: 150000,
        },
        {
          id: generateId(),
          name: "Staff Training Hours",
          unit: "hours",
          distribution: "normal",
          mean: 200,
          stdDev: 50,
        },
      ],
    },
  },

  {
    id: "tmpl-security",
    type: "security_incident",
    name: "Security Incident Response",
    description: "Quantify breach impact and recovery time",
    icon: "🔒",
    scenario: {
      title: "Security Breach Impact Analysis",
      description: "Model downtime, remediation cost, and reputation damage",
      timeHorizonDays: 7,
      nRuns: 10000,
      volatility: 1.5,
      correlationType: "pearson",
      primaryKPI: "cost_overrun",
      variables: [
        {
          id: generateId(),
          name: "Detection to Containment (hours)",
          unit: "hours",
          distribution: "lognormal",
          mean: 3.5,
          stdDev: 1.0,
        },
        {
          id: generateId(),
          name: "Forensics & Remediation Cost",
          unit: "USD",
          distribution: "pert",
          min: 10000,
          mostLikely: 50000,
          max: 200000,
          lambda: 4,
        },
        {
          id: generateId(),
          name: "Revenue Loss per Hour",
          unit: "USD/hour",
          distribution: "triangular",
          min: 500,
          mostLikely: 2000,
          max: 10000,
        },
      ],
    },
    riskSeeds: [
      {
        title: "Ransomware Attack",
        category: "technical",
        description: "Potential ransomware infection from phishing",
        likelihood: 3,
        impact: 5,
        mitigation: "Deploy EDR, MFA, and offline backups",
        status: "mitigating",
      },
    ],
  },

  {
    id: "tmpl-vendor",
    type: "vendor_bankruptcy",
    name: "Critical Vendor Failure",
    description: "Model impact of vendor bankruptcy or service termination",
    icon: "🏢",
    scenario: {
      title: "Vendor Bankruptcy Impact",
      description: "Assess continuity risk from critical vendor failure",
      timeHorizonDays: 60,
      nRuns: 5000,
      volatility: 1.3,
      correlationType: "pearson",
      primaryKPI: "delivery_delay",
      variables: [
        {
          id: generateId(),
          name: "Replacement Vendor Search (days)",
          unit: "days",
          distribution: "pert",
          min: 14,
          mostLikely: 30,
          max: 60,
          lambda: 4,
        },
        {
          id: generateId(),
          name: "Migration Cost",
          unit: "USD",
          distribution: "triangular",
          min: 15000,
          mostLikely: 40000,
          max: 100000,
        },
        {
          id: generateId(),
          name: "Service Downtime (days)",
          unit: "days",
          distribution: "lognormal",
          mean: 2.0,
          stdDev: 0.6,
        },
      ],
    },
  },

  {
    id: "tmpl-staff",
    type: "staff_absence",
    name: "Key Staff Absence",
    description: "Analyze impact of unplanned loss of critical personnel",
    icon: "👤",
    scenario: {
      title: "Key Staff Departure Impact",
      description: "Model delivery risk from loss of key engineer or leader",
      timeHorizonDays: 90,
      nRuns: 5000,
      volatility: 1.1,
      correlationType: "none",
      primaryKPI: "delivery_delay",
      variables: [
        {
          id: generateId(),
          name: "Handover Period (days)",
          unit: "days",
          distribution: "triangular",
          min: 0,
          mostLikely: 5,
          max: 15,
        },
        {
          id: generateId(),
          name: "Recruitment Time (days)",
          unit: "days",
          distribution: "pert",
          min: 30,
          mostLikely: 60,
          max: 120,
          lambda: 4,
        },
        {
          id: generateId(),
          name: "Productivity Loss (%)",
          unit: "%",
          distribution: "normal",
          mean: 30,
          stdDev: 10,
        },
      ],
    },
  },

  {
    id: "tmpl-currency",
    type: "currency_shock",
    name: "Currency Exchange Risk",
    description: "Model impact of currency fluctuations on costs",
    icon: "💱",
    scenario: {
      title: "Currency Shock Impact",
      description: "Assess exposure to sudden currency movements",
      timeHorizonDays: 30,
      nRuns: 10000,
      volatility: 1.2,
      correlationType: "none",
      primaryKPI: "cost_overrun",
      variables: [
        {
          id: generateId(),
          name: "Exchange Rate Movement (%)",
          unit: "%",
          distribution: "normal",
          mean: 0,
          stdDev: 5,
        },
        {
          id: generateId(),
          name: "Exposed Revenue",
          unit: "USD",
          distribution: "triangular",
          min: 50000,
          mostLikely: 100000,
          max: 250000,
        },
        {
          id: generateId(),
          name: "Hedging Cost (%)",
          unit: "%",
          distribution: "triangular",
          min: 0.5,
          mostLikely: 1.5,
          max: 3.0,
        },
      ],
    },
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByType(type: TemplateType): Template[] {
  return TEMPLATES.filter((t) => t.type === type);
}

export function getAllTemplates(): Template[] {
  return TEMPLATES;
}
