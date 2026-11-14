import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { getData, productById } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function ProductionPage() {
  const wos = getData().workOrders.filter((w) => w.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Production"
        subtitle="Work orders, cutting lists, scrap/yield. Supports cut-from-stock and make-to-order."
      />

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>Work order</th>
              <th>Mode</th>
              <th>Input</th>
              <th>Output</th>
              <th>Good / scrap</th>
              <th>Yield</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {wos.map((w) => (
              <tr key={w.id}>
                <td>
                  <Link href={`/production/${w.id}`} className="font-medium hover:underline">
                    {w.number}
                  </Link>
                  <div className="text-xs text-[var(--sf-muted)]">Due {w.dueDate}</div>
                </td>
                <td className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">
                  {w.mode.replace(/_/g, " ")}
                </td>
                <td>
                  <div className="text-sm">{productById(w.inputProductId)?.sku}</div>
                  <div className="text-xs text-[var(--sf-muted)]">
                    {w.inputQtySheets} sheets
                  </div>
                </td>
                <td className="text-sm">{w.outputDescription}</td>
                <td>
                  {w.goodQtySheets} / {w.scrapQtySheets}
                </td>
                <td className="font-semibold">
                  {w.yieldPct ? `${w.yieldPct.toFixed(1)}%` : "—"}
                </td>
                <td>
                  <StatusBadge status={w.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
