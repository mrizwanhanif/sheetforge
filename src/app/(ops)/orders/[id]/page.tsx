import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { dims, lineTotal, pkr } from "@/lib/format";
import { dealerById, getData, getSalesOrder } from "@/lib/store";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const o = getSalesOrder(id);
  if (!o) notFound();
  const dealer = dealerById(o.dealerId);
  const relatedWOs = getData().workOrders.filter((w) => w.salesOrderId === o.id);
  const relatedInv = getData().invoices.filter((i) => i.salesOrderId === o.id);
  const total = o.lines.reduce((s, l) => s + lineTotal(l.qtySheets, l.unitPricePkr), 0);

  return (
    <div>
      <PageHeader
        title={o.number}
        subtitle={`${dealer?.name} · due ${o.dueDate}`}
        actions={<StatusBadge status={o.status} />}
      />

      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <Link href="/orders" className="text-[var(--sf-muted)] hover:underline">
          ← Orders
        </Link>
        <span className="text-[var(--sf-muted)]">
          Production:{" "}
          <span className="font-medium text-[var(--sf-ink)]">
            {o.productionMode.replace(/_/g, " ")}
          </span>
        </span>
      </div>

      {o.notes ? (
        <p className="mb-4 rounded-md border border-[var(--sf-border)] bg-[var(--sf-panel)] px-3 py-2 text-sm">
          {o.notes}
        </p>
      ) : null}

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Line</th>
              <th>Dims</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {o.lines.map((l) => (
              <tr key={l.id}>
                <td>
                  <div className="font-medium">{l.description}</div>
                  <div className="text-xs text-[var(--sf-muted)]">
                    {l.isCustomCut ? "Custom cut" : "Standard"}
                    {l.priceOverride ? " · price override" : ""}
                  </div>
                </td>
                <td>{dims(l.lengthMm, l.widthMm, l.thicknessMm)}</td>
                <td>{l.qtySheets}</td>
                <td>{pkr(l.unitPricePkr)}</td>
                <td className="font-semibold">
                  {pkr(lineTotal(l.qtySheets, l.unitPricePkr))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Order total</div>
          <div className="font-display text-2xl font-semibold">{pkr(total)}</div>
        </div>
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Work orders</div>
          <ul className="mt-2 space-y-1 text-sm">
            {relatedWOs.map((w) => (
              <li key={w.id}>
                <Link href={`/production/${w.id}`} className="hover:underline">
                  {w.number}
                </Link>
              </li>
            ))}
            {relatedWOs.length === 0 ? (
              <li className="text-[var(--sf-muted)]">None linked</li>
            ) : null}
          </ul>
        </div>
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Invoices</div>
          <ul className="mt-2 space-y-1 text-sm">
            {relatedInv.map((i) => (
              <li key={i.id}>
                <Link href={`/invoices/${i.id}`} className="hover:underline">
                  {i.number}
                </Link>
              </li>
            ))}
            {relatedInv.length === 0 ? (
              <li className="text-[var(--sf-muted)]">Not invoiced yet</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
