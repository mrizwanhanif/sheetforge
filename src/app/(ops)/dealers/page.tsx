import { PageHeader } from "@/components/page-header";
import { num, pkr } from "@/lib/format";
import { getData, priceListById, productById } from "@/lib/store";
import { PILOT_TENANT_ID } from "@/lib/seed";

export default function DealersPage() {
  const data = getData();
  const dealers = data.dealers.filter((d) => d.tenantId === PILOT_TENANT_ID);
  const lists = data.priceLists.filter((p) => p.tenantId === PILOT_TENANT_ID);

  return (
    <div>
      <PageHeader
        title="Dealers & price lists"
        subtitle="Tiered dealer pricing with line-level override on quotes/orders."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <section className="sf-card overflow-hidden lg:col-span-3">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Dealers</h2>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>Dealer</th>
                <th>City</th>
                <th>Price list</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="font-medium">{d.name}</div>
                    <div className="text-xs text-[var(--sf-muted)]">
                      {d.code} · {d.contact}
                    </div>
                  </td>
                  <td>{d.city}</td>
                  <td>{priceListById(d.priceListId)?.name}</td>
                  <td>{pkr(d.creditLimitPkr)}</td>
                  <td className={d.balancePkr > 0 ? "font-semibold text-amber-800" : ""}>
                    {pkr(d.balancePkr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="sf-card overflow-hidden lg:col-span-2">
          <div className="border-b border-[var(--sf-border)] px-4 py-3">
            <h2 className="font-display text-base font-semibold">Price tiers</h2>
          </div>
          <div className="space-y-4 p-4">
            {lists.map((list) => {
              const items = data.priceListItems.filter((i) => i.priceListId === list.id);
              return (
                <div key={list.id}>
                  <div className="mb-2 flex items-baseline justify-between">
                    <div className="font-semibold">{list.name}</div>
                    <div className="text-xs uppercase tracking-wide text-[var(--sf-muted)]">
                      Tier {list.tier}
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm">
                    {items.slice(0, 4).map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span className="truncate text-[var(--sf-muted)]">
                          {productById(item.productId)?.sku}
                        </span>
                        <span className="font-medium">{pkr(item.unitPricePkr)}</span>
                      </li>
                    ))}
                    {items.length > 4 ? (
                      <li className="text-xs text-[var(--sf-muted)]">
                        +{num(items.length - 4)} more SKUs
                      </li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
