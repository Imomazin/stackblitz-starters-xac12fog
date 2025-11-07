import CopyButton from "./CopyButton";
export default function Section({
  title, children, copy
}:{ title:string; children:React.ReactNode; copy?:string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        {copy ? <CopyButton text={copy} /> : null}
      </div>
      <div className="prose-sm prose-ul:my-1">{children}</div>
    </div>
  );
}
