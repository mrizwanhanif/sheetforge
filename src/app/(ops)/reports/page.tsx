import { Metric } from "@/components/metric";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { num, pkr } from "@/lib/format";
import {
  arSummary,
  salesByDealer,
  scrapMetrics,
  stockByProduct,
} from "@/lib/store";

export default function ReportsPage() {
  const stock = stockByProduct();
  const sales = salesByDealer();
  const scrap = scrapMetrics();
  const ar = arSummary();
  const arTotal = ar.reduce((s, a) => s + a.outstanding, 0);

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Core set: stock, sales by dealer, scrap %, AR summary."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="SKUs tracked" value={String(stock.length)} />
        <Metric
          label="Sheets on hand"
          value={num(stock.reduce((s, x) => s + x.qty, 0))}
        />
        <Metric
          label="Scrap %"
          value={`${scrap.scrapPct.toFixed(1)}%`}
          hint={`Avg yield ${scrap.avgYield.toFixed(0)}%`}
          tone={scrap.scrapPct > 10 ? "warn" : "good"}
        />
        <Metric label="AR outstanding" value={pkr(arTotal)} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <section className="sf-card overflow-hidden xl:col-span-1">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Sales by dealer</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Dealer</th>
                <th>Booked</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.dealer.id}>
                  <td>{s.dealer.name}</td>
                  <td className="font-semibold">{pkr(s.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden xl:col-span-1">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Stock qty</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sheets</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.product.id}>
                  <td className="text-xs">{s.product.sku}</td>
                  <td
                    className={`font-semibold ${s.belowReorder ? "text-amber-800" : ""}`}
                  >
                    {num(s.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden xl:col-span-1">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">AR summary</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Outstanding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ar.map((a) => (
                <tr key={a.invoice.id}>
                  <td className="text-xs font-medium">{a.invoice.number}</td>
                  <td className="font-semibold">{pkr(a.outstanding)}</td>
                  <td>
                    <StatusBadge status={a.invoice.status} />
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
