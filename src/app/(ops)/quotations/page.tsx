import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { lineTotal, pkr } from "@/lib/format";
import { dealerById, getData } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function QuotationsPage() {
  const quotes = getData().quotations.filter((q) => q.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Quotations"
        subtitle="Build a quote, then convert to a sales order. Custom cut dims supported on lines."
        actions={<span className="sf-btn-ghost opacity-60">New quotation (stub)</span>}
      />

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Quote</th>
              <th>Dealer</th>
              <th>Created</th>
              <th>Valid until</th>
              <th>Lines</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => {
              const total = q.lines.reduce(
                (s, l) => s + lineTotal(l.qtySheets, l.unitPricePkr),
                0,
              );
              return (
                <tr key={q.id}>
                  <td>
                    <Link href={`/quotations/${q.id}`} className="font-medium hover:underline">
                      {q.number}
                    </Link>
                  </td>
                  <td>{dealerById(q.dealerId)?.name}</td>
                  <td>{q.createdAt}</td>
                  <td>{q.validUntil}</td>
                  <td>{q.lines.length}</td>
                  <td className="font-semibold">{pkr(total)}</td>
                  <td>
                    <StatusBadge status={q.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
