export function Badge({ children, intent = "neutral" }:{
  children: React.ReactNode; intent?: "neutral"|"low"|"medium"|"high";
}) {
  const map:any = {
    neutral: "bg-gray-100 text-gray-800",
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-rose-100 text-rose-800"
  };
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[intent]}`}>{children}</span>;
}
