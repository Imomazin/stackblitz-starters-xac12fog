"use client";
import dayjs from "dayjs";
import { useCoach } from "../store/useCoach";

export default function HeatmapMini() {
  const items = useCoach(s => s.items);
  const days = Array.from({ length: 28 }).map((_, i) => {
    const date = dayjs().subtract(27 - i, "day");
    const count = items.filter(x => dayjs(x.createdAt).isSame(date, "day")).length;
    return { date: date.format("MMM D"), count };
  });
  const max = Math.max(1, ...days.map(d => d.count));
  return (
    <div className="flex gap-1 items-end h-16">
      {days.map((d, i) => (
        <div
          key={i}
          title={`${d.date}: ${d.count}`}
          className="w-3 rounded bg-primary/20"
          style={{ height: `${(d.count / max) * 100}%` }}
        />
      ))}
    </div>
  );
}
