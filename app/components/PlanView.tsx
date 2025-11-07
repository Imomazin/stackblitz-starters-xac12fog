import Section from "./Section";
import { Badge } from "./Badge";

export default function PlanView({ plan }:{ plan:any }) {
  // rating can be "Low | Medium | High - reason" or object
  const ratingStr = typeof plan.rating === "string" ? plan.rating : `${plan?.rating?.level} - ${plan?.rating?.reason || ""}`;
  const level = (ratingStr || "").toLowerCase().startsWith("high") ? "high"
    : (ratingStr || "").toLowerCase().startsWith("medium") ? "medium"
    : (ratingStr || "").toLowerCase().startsWith("low") ? "low" : "neutral";

  const list = (x:any) => Array.isArray(x) ? x : [];
  return (
    <div className="space-y-4">
      <Section title="Summary" copy={plan.summary || ""}>
        <p>{plan.summary || "No summary"}</p>
      </Section>

      <Section title="Risk rating">
        <Badge intent={level}>{ratingStr || "Not set"}</Badge>
      </Section>

      <div className="grid md:grid-cols-3 gap-4">
        <Section title="24 hours" copy={list(plan.actions_24h).join("\n")}>
          <ul className="list-disc pl-5">{list(plan.actions_24h).map((a:string,i:number)=><li key={i}>{a}</li>)}</ul>
        </Section>
        <Section title="7 days" copy={list(plan.actions_7d).join("\n")}>
          <ul className="list-disc pl-5">{list(plan.actions_7d).map((a:string,i:number)=><li key={i}>{a}</li>)}</ul>
        </Section>
        <Section title="30 days" copy={list(plan.actions_30d).join("\n")}>
          <ul className="list-disc pl-5">{list(plan.actions_30d).map((a:string,i:number)=><li key={i}>{a}</li>)}</ul>
        </Section>
      </div>

      <Section title="Owners" copy={list(plan.owners).join(", ")}>
        <p>{list(plan.owners).join(", ") || "Unassigned"}</p>
      </Section>

      <Section title="Checklist" copy={list(plan.checklist).join("\n")}>
        <ul className="list-disc pl-5">{list(plan.checklist).map((c:string,i:number)=><li key={i}>{c}</li>)}</ul>
      </Section>

      <Section title="Template" copy={plan.template || ""}>
        <pre className="whitespace-pre-wrap text-sm">{plan.template || "No template"}</pre>
      </Section>
    </div>
  );
}
