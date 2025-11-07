"use client";
export default function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
      title="Copy to clipboard"
    >
      Copy
    </button>
  );
}
