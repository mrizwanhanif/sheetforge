export function Metric({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warn" | "good";
}) {
  const valueColor =
    tone === "warn"
      ? "text-amber-800"
      : tone === "good"
        ? "text-emerald-800"
        : "text-[var(--sf-ink)]";

  return (
    <div className="rounded-lg border border-[var(--sf-border)] bg-[var(--sf-panel)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sf-muted)]">
        {label}
      </div>
      <div className={`mt-1 font-display text-2xl font-semibold ${valueColor}`}>
        {value}
      </div>
      {hint ? <div className="mt-1 text-xs text-[var(--sf-muted)]">{hint}</div> : null}
    </div>
  );
}
