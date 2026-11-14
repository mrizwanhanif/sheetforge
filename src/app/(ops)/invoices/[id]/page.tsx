import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { dims, invoiceTotals, pkr } from "@/lib/format";
import { dealerById, getInvoice, getPilotTenant, getSalesOrder } from "@/lib/store";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = getInvoice(id);
  if (!inv) notFound();
  const tenant = getPilotTenant();
  const dealer = dealerById(inv.dealerId);
  const so = getSalesOrder(inv.salesOrderId);
  const { subtotal, tax, total } = invoiceTotals(inv.lines, inv.taxPct);
  const outstanding = Math.max(0, total - inv.paidPkr);

  return (
    <div>
      <PageHeader
        title={inv.number}
        subtitle={`${dealer?.name} · ${tenant.brandName} tax invoice`}
        actions={
          <>
            <StatusBadge status={inv.status} />
            <Link href={`/print/invoices/${inv.id}`} className="sf-btn-accent">
              Print / PDF view
            </Link>
          </>
        }
      />

      <div className="mb-4 text-sm">
        <Link href="/invoices" className="text-[var(--sf-muted)] hover:underline">
          ← Invoices
        </Link>
        {so ? (
          <span className="ml-4 text-[var(--sf-muted)]">
            From{" "}
            <Link href={`/orders/${so.id}`} className="hover:underline">
              {so.number}
            </Link>
          </span>
        ) : null}
      </div>

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Dims</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.lines.map((l) => (
              <tr key={l.id}>
                <td className="font-medium">{l.description}</td>
                <td>{dims(l.lengthMm, l.widthMm, l.thicknessMm)}</td>
                <td>{l.qtySheets}</td>
                <td>{pkr(l.unitPricePkr)}</td>
                <td className="font-semibold">
                  {pkr(l.qtySheets * l.unitPricePkr)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs space-y-1 rounded-lg border border-[var(--sf-border)] bg-[var(--sf-panel)] px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--sf-muted)]">Subtotal</span>
            <span>{pkr(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--sf-muted)]">Sales tax ({inv.taxPct}%)</span>
            <span>{pkr(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--sf-border)] pt-2 font-display text-lg font-semibold">
            <span>Total</span>
            <span>{pkr(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--sf-muted)]">Paid</span>
            <span>{pkr(inv.paidPkr)}</span>
          </div>
          <div className="flex justify-between font-semibold text-amber-800">
            <span>Outstanding</span>
            <span>{pkr(outstanding)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
