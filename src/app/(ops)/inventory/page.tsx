import { PageHeader } from "@/components/page-header";
import { num } from "@/lib/format";
import {
  getData,
  productById,
  stockByProduct,
  warehouseById,
} from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function InventoryPage() {
  const stock = stockByProduct();
  const warehouses = getData().warehouses.filter((w) => w.tenantId === PILOT_TENANT_ID);
  const movements = getData()
    .movements.filter((m) => m.tenantId === PILOT_TENANT_ID)
    .slice()
    .sort((a, b) => b.at.localeCompare(a.at));
  const batches = getData().batches.filter((b) => b.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Sheet qty by SKU + batch/lot, with ledger-style movements."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {warehouses.map((w) => (
          <div
            key={w.id}
            className="rounded-md border border-[var(--sf-border)] bg-[var(--sf-panel)] px-3 py-2 text-sm"
          >
            <span className="font-semibold">{w.code}</span>
            <span className="mx-1.5 text-[var(--sf-muted)]">·</span>
            {w.name}
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="sf-card overflow-hidden">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Stock by SKU</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Sheets</th>
                <th>Lots</th>
                <th>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((s) => (
                <tr key={s.product.id}>
                  <td>
                    <div className="font-medium">{s.product.name}</div>
                    <div className="text-xs text-[var(--sf-muted)]">{s.product.sku}</div>
                  </td>
                  <td
                    className={`font-semibold ${s.belowReorder ? "text-amber-800" : ""}`}
                  >
                    {num(s.qty)}
                  </td>
                  <td>{s.batches.length}</td>
                  <td>{s.product.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Batches / lots</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Lot</th>
                <th>SKU</th>
                <th>Warehouse</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className="font-mono text-xs font-semibold">{b.lotCode}</div>
                    <div className="text-xs text-[var(--sf-muted)]">{b.receivedAt}</div>
                  </td>
                  <td className="text-xs">{productById(b.productId)?.sku}</td>
                  <td>{warehouseById(b.warehouseId)?.code}</td>
                  <td className="font-semibold">{num(b.qtySheets)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="sf-card mt-4 overflow-hidden">
        <div className="border-b border-[var(--sf-border)] px-4 py-3">
          <h2 className="font-display text-base font-semibold">Stock ledger</h2>
        </div>
        <table className="sf-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Type</th>
              <th>SKU</th>
              <th>Warehouse</th>
              <th>Qty</th>
              <th>Reference</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id}>
                <td className="whitespace-nowrap text-xs">{m.at.replace("T", " ")}</td>
                <td className="text-xs uppercase tracking-wide">{m.type.replace(/_/g, " ")}</td>
                <td className="text-xs">{productById(m.productId)?.sku}</td>
                <td>{warehouseById(m.warehouseId)?.code}</td>
                <td
                  className={`font-semibold ${m.qtySheets < 0 ? "text-rose-800" : "text-emerald-800"}`}
                >
                  {m.qtySheets > 0 ? "+" : ""}
                  {m.qtySheets}
                </td>
                <td className="text-xs">
                  {m.refType} {m.refNo}
                </td>
                <td className="text-xs text-[var(--sf-muted)]">{m.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
