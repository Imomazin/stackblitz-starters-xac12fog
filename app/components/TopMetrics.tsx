"use client";
import dayjs from "dayjs";
import { useCoach } from "../store/useCoach";

export default function TopMetrics() {
  const items = useCoach(s => s.items);
  const today = items.filter(x => dayjs(x.createdAt).isAfter(dayjs().startOf("day"))).length;
  const last = items[0];
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      <Stat label="Plans today" value={today} />
      <Stat label="Total saved" value={items.length} />
      <Stat label="Last rating" value={last?.rating || "—"} />
    </div>
  );
}
function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-surface border border-border p-3">
      <div className="text-xs text-textMute">{label}</div>
      <div className="text-xl font-semibold">{String(value)}</div>
    </div>
  );
}
