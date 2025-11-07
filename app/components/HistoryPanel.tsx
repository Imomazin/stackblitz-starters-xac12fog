"use client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useCoach } from "../store/useCoach";

dayjs.extend(relativeTime);

export default function HistoryPanel({ onLoad }: { onLoad: (id: string) => void }) {
  const items = useCoach(s => s.items);
  const remove = useCoach(s => s.remove);
  const clear = useCoach(s => s.clear);
  if (!items.length) return null;

  return (
    <div className="rounded-2xl bg-surface border border-border p-4">
      <div className="flex items-center justify-between">
        <div className="font-medium">History</div>
        <button onClick={clear} className="text-xs text-textMute hover:underline">Clear</button>
      </div>
      <ul className="mt-3 space-y-2">
        {items.slice(0, 10).map(it => (
          <li key={it.id} className="flex items-start justify-between gap-2">
            <button onClick={() => onLoad(it.id)} className="text-left hover:underline">
              <div className="text-sm line-clamp-1">{it.input}</div>
              <div className="text-xs text-textMute">{dayjs(it.createdAt).fromNow()}</div>
            </button>
            <button onClick={() => remove(it.id)} className="text-xs text-textMute hover:underline">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
