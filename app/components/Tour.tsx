"use client";
import { useEffect, useState } from "react";

export default function Tour() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const k = "rc_tour_seen_v1";
    const seen = localStorage.getItem(k);
    if (!seen) { setShow(true); localStorage.setItem(k, "1"); }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-md">
        <h3 className="text-lg font-semibold mb-2">Welcome to VLV Risk Coach</h3>
        <p className="text-sm text-textMute">
          Type a situation on the left, press Get Guidance, then review your plan on the right.
          Use the theme toggle in the header. Your last runs are saved in History.
        </p>
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-1.5 rounded-lg border border-border" onClick={() => setShow(false)}>Got it</button>
        </div>
      </div>
    </div>
  );
}
