'use client';

import { X, ExternalLink, CheckCircle, AlertTriangle, Target, TrendingUp } from 'lucide-react';
import { CaseStudy } from '@/lib/data/caseStudies';
import { motion, AnimatePresence } from 'framer-motion';

type CaseStudyModalProps = {
  caseStudy: CaseStudy | null;
  onClose: () => void;
};

export function CaseStudyModal({ caseStudy, onClose }: CaseStudyModalProps) {
  if (!caseStudy) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface border-2 border-primary/30 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Header Image */}
          <div className="relative h-64 overflow-hidden rounded-t-2xl">
            <div className={`absolute inset-0 bg-gradient-to-br ${caseStudy.gradient}`}>
              <img
                src={caseStudy.imageUrl}
                alt={caseStudy.title}
                className="w-full h-full object-cover opacity-30"
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className={`inline-block self-start px-4 py-2 ${caseStudy.badgeColor} rounded-lg font-bold text-sm mb-4`}>
                {caseStudy.riskBadge}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">{caseStudy.title}</h2>
              <p className="text-white/90 text-lg">{caseStudy.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Overview */}
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Project Overview
              </h3>
              <p className="text-textMute leading-relaxed">{caseStudy.overview}</p>
            </section>

            {/* Project Details */}
            <section className="grid md:grid-cols-2 gap-4">
              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Project Details</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-textMute">Duration</dt>
                    <dd className="font-medium">{caseStudy.projectDetails.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-textMute">Budget</dt>
                    <dd className="font-medium">{caseStudy.projectDetails.budget}</dd>
                  </div>
                  <div>
                    <dt className="text-textMute">Location</dt>
                    <dd className="font-medium">{caseStudy.projectDetails.location}</dd>
                  </div>
                  <div>
                    <dt className="text-textMute">Stakeholders</dt>
                    <dd className="font-medium">{caseStudy.projectDetails.stakeholders}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-background border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Key Metrics</h4>
                <dl className="space-y-2 text-sm">
                  {caseStudy.keyMetrics.map((metric, idx) => (
                    <div key={idx}>
                      <dt className="text-textMute">{metric.label}</dt>
                      <dd className="font-medium text-primary">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            {/* Risk Challenges */}
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Risk Challenges
              </h3>
              <ul className="space-y-2">
                {caseStudy.riskChallenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-textMute">
                    <span className="text-orange-500 mt-1">▸</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Risk Methods Used */}
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-500" />
                Risk Management Methods
              </h3>
              <ul className="space-y-2">
                {caseStudy.riskMethodsUsed.map((method, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-textMute">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>{method}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Outcomes */}
            <section>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Outcomes & Results
              </h3>
              <ul className="space-y-2">
                {caseStudy.outcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-textMute">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold mb-3">
                Want to apply similar risk management strategies to your projects?
              </p>
              <button className="btn-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto">
                <ExternalLink className="w-5 h-5" />
                Explore R_LUMINA Tools
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
