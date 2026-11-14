import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { dims } from "@/lib/format";
import {
  getData,
  getSalesOrder,
  getWorkOrder,
  productById,
  warehouseById,
} from "@/lib/store";

export default async function WorkOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = getWorkOrder(id);
  if (!w) notFound();
  const so = w.salesOrderId ? getSalesOrder(w.salesOrderId) : undefined;
  const batch = getData().batches.find((b) => b.id === w.inputBatchId);

  return (
    <div>
      <PageHeader
        title={w.number}
        subtitle={`${w.outputDescription} · ${warehouseById(w.warehouseId)?.name}`}
        actions={<StatusBadge status={w.status} />}
      />

      <div className="mb-4 text-sm">
        <Link href="/production" className="text-[var(--sf-muted)] hover:underline">
          ← Production
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Mode</div>
          <div className="mt-1 font-semibold capitalize">
            {w.mode.replace(/_/g, " ")}
          </div>
          {so ? (
            <div className="mt-2 text-sm">
              Linked SO:{" "}
              <Link href={`/orders/${so.id}`} className="hover:underline">
                {so.number}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">Input</div>
          <div className="mt-1 font-semibold">{productById(w.inputProductId)?.name}</div>
          <div className="text-sm text-[var(--sf-muted)]">
            {w.inputQtySheets} sheets
            {batch ? ` · ${batch.lotCode}` : ""}
          </div>
        </div>
        <div className="sf-card p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">
            Yield / scrap
          </div>
          <div className="mt-1 font-display text-2xl font-semibold">
            {w.yieldPct ? `${w.yieldPct.toFixed(1)}%` : "—"}
          </div>
          <div className="text-sm text-[var(--sf-muted)]">
            Good {w.goodQtySheets} · Scrap {w.scrapQtySheets}
            {w.scrapReason ? ` · ${w.scrapReason}` : ""}
          </div>
        </div>
      </div>

      <section className="sf-card mt-4 overflow-hidden">
        <div className="border-b border-[var(--sf-border)] px-4 py-3">
          <h2 className="font-display text-base font-semibold">Cutting list</h2>
        </div>
        <table className="sf-table">
          <thead>
            <tr>
              <th>Piece dims</th>
              <th>Qty</th>
              <th>Parent SKU</th>
              <th>Est. scrap</th>
            </tr>
          </thead>
          <tbody>
            {w.cuttingList.map((c) => (
              <tr key={c.id}>
                <td>{dims(c.pieceLengthMm, c.pieceWidthMm)}</td>
                <td className="font-semibold">{c.qty}</td>
                <td className="text-xs">{productById(c.parentProductId)?.sku}</td>
                <td>{c.estimatedScrapPct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-sm text-[var(--sf-muted)]">
        Scrap/yield entry UI is demo-ready for display; write-back forms are stubbed until
        Postgres persistence.
      </p>
    </div>
  );
}
