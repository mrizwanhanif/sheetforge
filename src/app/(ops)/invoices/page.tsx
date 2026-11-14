import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { invoiceTotals, pkr } from "@/lib/format";
import { dealerById, getData } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function InvoicesPage() {
  const invoices = getData().invoices.filter((i) => i.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="PDF-ready HTML print views with NTN/company fields. No FBR API yet."
      />

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Dealer</th>
              <th>Issued</th>
              <th>Due</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const { total } = invoiceTotals(inv.lines, inv.taxPct);
              return (
                <tr key={inv.id}>
                  <td>
                    <Link href={`/invoices/${inv.id}`} className="font-medium hover:underline">
                      {inv.number}
                    </Link>
                  </td>
                  <td>{dealerById(inv.dealerId)?.name}</td>
                  <td>{inv.issuedAt}</td>
                  <td>{inv.dueDate}</td>
                  <td className="font-semibold">{pkr(total)}</td>
                  <td>{pkr(inv.paidPkr)}</td>
                  <td>
                    <StatusBadge status={inv.status} />
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
