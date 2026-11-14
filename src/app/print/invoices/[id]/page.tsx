import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { dims, invoiceTotals, pkr } from "@/lib/format";
import { dealerById, getInvoice, getPilotTenant } from "@/lib/store";

export default async function InvoicePrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inv = getInvoice(id);
  if (!inv) notFound();
  const tenant = getPilotTenant();
  const dealer = dealerById(inv.dealerId);
  const { subtotal, tax, total } = invoiceTotals(inv.lines, inv.taxPct);

  return (
    <div className="min-h-screen bg-[var(--sf-canvas)] print:bg-white">
      <div className="mx-auto max-w-3xl bg-white px-6 py-8 text-[var(--sf-ink)] shadow-sm print:max-w-none print:px-8 print:py-6 print:shadow-none">
        <div className="no-print mb-6 flex items-center justify-between gap-3">
          <Link href={`/invoices/${inv.id}`} className="sf-btn-ghost">
            ← Back to invoice
          </Link>
          <PrintButton />
        </div>

        <header className="flex items-start justify-between gap-6 border-b-2 border-[var(--sf-ink)] pb-4">
          <div>
            <div
              className="font-display text-3xl font-extrabold tracking-tight"
              style={{ color: tenant.primaryColor }}
            >
              {tenant.logoText}
            </div>
            <div className="mt-1 text-sm font-semibold">{tenant.legalName}</div>
            <div className="mt-2 text-xs leading-relaxed text-[var(--sf-muted)]">
              {tenant.address}
              <br />
              {tenant.city}
              <br />
              {tenant.phone} · {tenant.email}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-display text-xl font-bold">TAX INVOICE</div>
            <div className="mt-2 font-mono font-semibold">{inv.number}</div>
            <div className="mt-3 space-y-0.5 text-xs">
              <div>
                <span className="text-[var(--sf-muted)]">NTN:</span> {tenant.ntn}
              </div>
              <div>
                <span className="text-[var(--sf-muted)]">STRN:</span>{" "}
                {tenant.strn || "—"}
              </div>
              <div>
                <span className="text-[var(--sf-muted)]">Date:</span> {inv.issuedAt}
              </div>
              <div>
                <span className="text-[var(--sf-muted)]">Due:</span> {inv.dueDate}
              </div>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sf-muted)]">
              Bill to
            </div>
            <div className="mt-1 font-semibold">{dealer?.name}</div>
            <div className="text-[var(--sf-muted)]">
              {dealer?.city}
              <br />
              Attn: {dealer?.contact}
              <br />
              {dealer?.phone}
            </div>
          </div>
          <div className="md:text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--sf-muted)]">
              Brand
            </div>
            <div className="mt-1 font-semibold">{tenant.brandName}</div>
            <div className="text-xs text-[var(--sf-muted)]">
              Currency {tenant.currency} · Sales tax {inv.taxPct}%
            </div>
          </div>
        </section>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sf-ink)]">
              <th className="py-2 pr-2 text-[11px] uppercase tracking-wide">Description</th>
              <th className="py-2 pr-2 text-[11px] uppercase tracking-wide">Dims</th>
              <th className="py-2 pr-2 text-[11px] uppercase tracking-wide">Qty</th>
              <th className="py-2 pr-2 text-[11px] uppercase tracking-wide">Rate</th>
              <th className="py-2 text-right text-[11px] uppercase tracking-wide">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.lines.map((l) => (
              <tr key={l.id} className="border-b border-[var(--sf-border)]">
                <td className="py-2.5 pr-2">{l.description}</td>
                <td className="py-2.5 pr-2 text-xs">
                  {dims(l.lengthMm, l.widthMm, l.thicknessMm)}
                </td>
                <td className="py-2.5 pr-2">{l.qtySheets}</td>
                <td className="py-2.5 pr-2">{pkr(l.unitPricePkr)}</td>
                <td className="py-2.5 text-right font-medium">
                  {pkr(l.qtySheets * l.unitPricePkr)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-56 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{pkr(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Sales tax</span>
              <span>{pkr(tax)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-[var(--sf-ink)] pt-2 text-base font-bold">
              <span>Total</span>
              <span>{pkr(total)}</span>
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-[var(--sf-border)] pt-4 text-xs text-[var(--sf-muted)]">
          Computer-generated tax invoice for {tenant.legalName} trading as{" "}
          {tenant.brandName}. FBR e-invoicing API not connected in pilot.
        </footer>
      </div>
    </div>
  );
}
