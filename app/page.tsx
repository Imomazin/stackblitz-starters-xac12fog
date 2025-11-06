"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");

  async function handleClick() {
    setReply("Thinking...");
    try {
      const res = await fetch("/api/riskcoach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setReply(data.reply || "No response.");
    } catch {
      setReply("Network error. Try again.");
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Risk Coach MVP</h1>
      <p>Type a line and click Get Guidance.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 4,
          border: "1px solid #ccc",
          marginTop: 8,
        }}
        placeholder="My supplier will be two weeks late..."
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={handleClick}
          style={{
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Get Guidance
        </button>
      </div>

      <pre
        style={{
          background: "#f6f6f6",
          padding: 12,
          marginTop: 16,
          minHeight: 80,
          whiteSpace: "pre-wrap",
          borderRadius: 4,
        }}
      >
        {reply}
      </pre>
    </main>
  );
}
