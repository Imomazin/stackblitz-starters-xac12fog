"use client";
const templates = [
  "Supplier shipment delayed by 3 weeks due to port congestion. Stock covers 10 days.",
  "Payment processor outage impacted 12% of checkouts for 90 minutes.",
  "Key engineer on leave. Delivery risk on Release 1.3 within two weeks.",
  "New regulation may affect data retention policy. Evaluate in 30 days."
];
export default function TemplatesDrawer({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-3">
      <div className="text-sm font-medium mb-2">Templates</div>
      <div className="flex flex-wrap gap-2">
        {templates.map((t, i) => (
          <button
            key={i}
            onClick={() => onPick(t)}
            className="text-left text-sm px-3 py-2 rounded-lg border border-border hover:bg-surface/60"
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
