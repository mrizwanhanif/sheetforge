import { PageHeader } from "@/components/page-header";
import { dims, num, pkr } from "@/lib/format";
import { getTenantProducts, stockByProduct } from "@/lib/store";

export default function CatalogPage() {
  const products = getTenantProducts();
  const stock = stockByProduct();
  const qtyMap = new Map(stock.map((s) => [s.product.id, s.qty]));

  return (
    <div>
      <PageHeader
        title="Catalog"
        subtitle="Foam board SKUs — material, thickness, size, grade/density. Custom cut dims are captured on quote/order lines."
        actions={<span className="sf-btn-ghost opacity-60">Add SKU (stub)</span>}
      />

      <div className="sf-card overflow-x-auto">
        <table className="sf-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Material</th>
              <th>Thickness</th>
              <th>Sheet size</th>
              <th>Grade</th>
              <th>Base price</th>
              <th>On hand</th>
              <th>Batch</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="font-medium">{p.name}</div>
                  <div className="font-mono text-xs text-[var(--sf-muted)]">{p.sku}</div>
                </td>
                <td>
                  <span className="rounded bg-[var(--sf-ink)]/5 px-1.5 py-0.5 text-xs font-semibold">
                    {p.material}
                  </span>
                </td>
                <td>{p.thicknessMm} mm</td>
                <td>{dims(p.lengthMm, p.widthMm)}</td>
                <td>{p.densityGrade}</td>
                <td>{pkr(p.basePricePkr)}</td>
                <td className="font-semibold">{num(qtyMap.get(p.id) ?? 0)}</td>
                <td className="text-xs text-[var(--sf-muted)]">
                  {p.trackBatch ? "Lot tracked" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-[var(--sf-muted)]">
        Custom cut example: order line can specify 1200×600 mm from a parent XPS 50mm
        sheet — production then generates a cutting list.
      </p>
    </div>
  );
}
