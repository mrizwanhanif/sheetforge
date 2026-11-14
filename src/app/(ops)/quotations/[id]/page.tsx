import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvertQuoteButton } from "@/components/convert-quote-button";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { dims, lineTotal, pkr } from "@/lib/format";
import { dealerById, getQuotation } from "@/lib/store";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const q = getQuotation(id);
  if (!q) notFound();
  const dealer = dealerById(q.dealerId);
  const total = q.lines.reduce((s, l) => s + lineTotal(l.qtySheets, l.unitPricePkr), 0);

  return (
    <div>
      <PageHeader
        title={q.number}
        subtitle={`${dealer?.name} · valid until ${q.validUntil}`}
        actions={
          <>
            <StatusBadge status={q.status} />
            <ConvertQuoteButton
              quotationId={q.id}
              disabled={q.status === "converted" || q.status === "cancelled"}
            />
          </>
        }
      />

      <div className="mb-4 text-sm">
        <Link href="/quotations" className="text-[var(--sf-muted)] hover:underline">
          ← Quotations
        </Link>
      </div>

      {q.notes ? (
        <p className="mb-4 rounded-md border border-[var(--sf-border)] bg-[var(--sf-panel)] px-3 py-2 text-sm">
          {q.notes}
        </p>
      ) : null}

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Dims</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Line</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {q.lines.map((l) => (
              <tr key={l.id}>
                <td className="font-medium">{l.description}</td>
                <td>{dims(l.lengthMm, l.widthMm, l.thicknessMm)}</td>
                <td>{l.qtySheets}</td>
                <td>
                  {pkr(l.unitPricePkr)}
                  {l.priceOverride ? (
                    <span className="ml-1 text-[10px] uppercase text-amber-700">override</span>
                  ) : null}
                </td>
                <td className="font-semibold">
                  {pkr(lineTotal(l.qtySheets, l.unitPricePkr))}
                </td>
                <td className="text-xs text-[var(--sf-muted)]">
                  {l.isCustomCut ? "Custom cut" : "Standard sheet"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="rounded-lg border border-[var(--sf-border)] bg-[var(--sf-panel)] px-4 py-3 text-right">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Quote total</div>
          <div className="font-display text-2xl font-semibold">{pkr(total)}</div>
        </div>
      </div>
    </div>
  );
}
