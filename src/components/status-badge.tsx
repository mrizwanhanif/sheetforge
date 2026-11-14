import { statusLabel } from "@/lib/format";

const tones: Record<string, string> = {
  draft: "bg-stone-200 text-stone-700",
  sent: "bg-sky-100 text-sky-800",
  accepted: "bg-emerald-100 text-emerald-800",
  converted: "bg-teal-100 text-teal-900",
  open: "bg-amber-100 text-amber-900",
  in_progress: "bg-orange-100 text-orange-900",
  completed: "bg-emerald-100 text-emerald-900",
  cancelled: "bg-rose-100 text-rose-800",
  partial: "bg-yellow-100 text-yellow-900",
  paid: "bg-emerald-100 text-emerald-900",
  overdue: "bg-rose-100 text-rose-900",
  ordered: "bg-sky-100 text-sky-900",
  received: "bg-emerald-100 text-emerald-900",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[status] ?? "bg-stone-100 text-stone-700"}`}
    >
      {statusLabel(status)}
    </span>
  );
}
