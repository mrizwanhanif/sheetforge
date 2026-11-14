import Link from "next/link";
import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { num, pkr } from "@/lib/format";
import {
  arSummary,
  dealerById,
  getPilotTenant,
  openOrders,
  scrapMetrics,
  stockAlerts,
} from "@/lib/store";

export default function DashboardPage() {
  const tenant = getPilotTenant();
  const alerts = stockAlerts();
  const orders = openOrders();
  const scrap = scrapMetrics();
  const ar = arSummary();
  const arOpen = ar.reduce((s, a) => s + a.outstanding, 0);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`${tenant.legalName} · ${tenant.brandName} · sample ops pulse`}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Stock alerts"
          value={String(alerts.length)}
          hint="SKUs below reorder level"
          tone={alerts.length ? "warn" : "good"}
        />
        <Metric
          label="Open orders"
          value={String(orders.length)}
          hint="Sales orders in flight"
        />
        <Metric
          label="Scrap %"
          value={`${scrap.scrapPct.toFixed(1)}%`}
          hint={`Avg yield ${scrap.avgYield.toFixed(0)}% · ${scrap.workOrders} WOs`}
          tone={scrap.scrapPct > 10 ? "warn" : "good"}
        />
        <Metric label="AR outstanding" value={pkr(arOpen)} hint="Open + partial invoices" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="sf-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Low stock</h2>
            <Link href="/inventory" className="text-xs font-semibold text-[var(--sf-muted)] hover:text-[var(--sf-ink)]">
              Inventory →
            </Link>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>On hand</th>
                <th>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => (
                <tr key={a.product.id}>
                  <td>
                    <div className="font-medium">{a.product.name}</div>
                    <div className="text-xs text-[var(--sf-muted)]">{a.product.sku}</div>
                  </td>
                  <td className="font-semibold text-amber-800">{num(a.qty)} sheets</td>
                  <td>{a.product.reorderLevel}</td>
                </tr>
              ))}
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-[var(--sf-muted)]">
                    All SKUs above reorder.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Open sales orders</h2>
            <Link href="/orders" className="text-xs font-semibold text-[var(--sf-muted)] hover:text-[var(--sf-ink)]">
              Orders →
            </Link>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Dealer</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/orders/${o.id}`} className="font-medium hover:underline">
                      {o.number}
                    </Link>
                    <div className="text-xs text-[var(--sf-muted)]">Due {o.dueDate}</div>
                  </td>
                  <td>{dealerById(o.dealerId)?.name}</td>
                  <td className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">
                    {o.productionMode.replace(/_/g, " ")}
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
