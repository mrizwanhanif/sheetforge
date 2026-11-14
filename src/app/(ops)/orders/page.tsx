import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { lineTotal, pkr } from "@/lib/format";
import { dealerById, getData } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function OrdersPage() {
  const orders = getData().salesOrders.filter((o) => o.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Sales orders"
        subtitle="Default production mode: cut-from-stock when stock available; MTO supported."
      />

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Dealer</th>
              <th>Created</th>
              <th>Due</th>
              <th>Mode</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const total = o.lines.reduce(
                (s, l) => s + lineTotal(l.qtySheets, l.unitPricePkr),
                0,
              );
              return (
                <tr key={o.id}>
                  <td>
                    <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
                      {o.number}
                    </Link>
                    {o.quotationId ? (
                      <div className="text-xs text-[var(--sf-muted)]">From quote</div>
                    ) : null}
                  </td>
                  <td>{dealerById(o.dealerId)?.name}</td>
                  <td>{o.createdAt}</td>
                  <td>{o.dueDate}</td>
                  <td className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">
                    {o.productionMode.replace(/_/g, " ")}
                  </td>
                  <td className="font-semibold">{pkr(total)}</td>
                  <td>
                    <StatusBadge status={o.status} />
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
