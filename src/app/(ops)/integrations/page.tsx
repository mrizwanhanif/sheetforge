import { PageHeader } from "@/components/page-header";

const stubs = [
  {
    name: "WhatsApp",
    detail: "Order confirmations & delivery updates to dealers",
    status: "Placeholder",
  },
  {
    name: "Excel import / export",
    detail: "Catalog, stock, and dealer price list spreadsheets",
    status: "Placeholder",
  },
  {
    name: "Accounting export",
    detail: "Invoice & payment CSV / journal export",
    status: "Placeholder",
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        subtitle="Stub screens only — real WhatsApp, Excel, and accounting connectors come after the core loop."
      />

      <div className="grid gap-3 md:grid-cols-3">
        {stubs.map((s) => (
          <div key={s.name} className="sf-card p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-display text-lg font-semibold">{s.name}</h2>
              <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-700">
                {s.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--sf-muted)]">{s.detail}</p>
            <button type="button" className="sf-btn-ghost mt-4 opacity-60" disabled>
              Connect (coming later)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
