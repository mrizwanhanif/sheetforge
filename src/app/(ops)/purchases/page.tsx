import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { pkr } from "@/lib/format";
import { getData, productById, warehouseById } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function PurchasesPage() {
  const data = getData();
  const pos = data.purchaseOrders.filter((p) => p.tenantId === PILOT_TENANT_ID);
  const grns = data.goodsReceipts.filter((g) => g.tenantId === PILOT_TENANT_ID);
  const suppliers = Object.fromEntries(
    data.suppliers.filter((s) => s.tenantId === PILOT_TENANT_ID).map((s) => [s.id, s]),
  );

  return (
    <div>
      <PageHeader
        title="Purchases"
        subtitle="Thin MVP: purchase orders + goods receipts (GRN). No three-way match yet."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="sf-card overflow-hidden">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Purchase orders</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>PO</th>
                <th>Supplier</th>
                <th>Lines</th>
                <th>Expected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => {
                const value = po.lines.reduce(
                  (s, l) => s + l.qtySheets * l.unitCostPkr,
                  0,
                );
                return (
                  <tr key={po.id}>
                    <td>
                      <div className="font-medium">{po.number}</div>
                      <div className="text-xs text-[var(--sf-muted)]">{pkr(value)}</div>
                    </td>
                    <td>{suppliers[po.supplierId]?.name}</td>
                    <td>
                      <ul className="text-xs text-[var(--sf-muted)]">
                        {po.lines.map((l, i) => (
                          <li key={i}>
                            {productById(l.productId)?.sku} × {l.qtySheets}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{po.expectedAt}</td>
                    <td>
                      <StatusBadge status={po.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Goods receipts (GRN)</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>GRN</th>
                <th>Warehouse</th>
                <th>Received</th>
                <th>Lots</th>
              </tr>
            </thead>
            <tbody>
              {grns.map((g) => (
                <tr key={g.id}>
                  <td className="font-medium">{g.number}</td>
                  <td>{warehouseById(g.warehouseId)?.code}</td>
                  <td>{g.receivedAt}</td>
                  <td>
                    <ul className="text-xs">
                      {g.lines.map((l, i) => (
                        <li key={i}>
                          {l.batchLotCode} · {l.qtySheets} sheets
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-[var(--sf-border)] px-4 py-3 text-xs text-[var(--sf-muted)]">
            Stub: create PO / post GRN actions not wired — seed data only.
          </p>
        </section>
      </div>
    </div>
  );
}
