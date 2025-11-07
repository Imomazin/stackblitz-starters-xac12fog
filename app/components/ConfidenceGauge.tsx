"use client";
const R = 28;
const C = 2 * Math.PI * R;
export default function ConfidenceGauge({ score = 0.66 }: { score?: number }) {
  const clamped = Math.max(0, Math.min(1, score));
  const dash = C * clamped;
  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={R} stroke="var(--border)" strokeWidth="8" fill="transparent" />
        <circle
          cx="36" cy="36" r={R} stroke="var(--secondary)" strokeWidth="8" fill="transparent"
          strokeDasharray={`${dash} ${C - dash}`} strokeLinecap="round" transform="rotate(-90 36 36)"
        />
      </svg>
      <div>
        <div className="text-sm font-medium">Confidence</div>
        <div className="text-lg font-semibold">{Math.round(clamped * 100)}%</div>
      </div>
    </div>
  );
}
