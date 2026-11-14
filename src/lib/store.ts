import { seedData, PILOT_TENANT_ID } from "./seed";
import type {
  AppData,
  Dealer,
  Invoice,
  Product,
  Quotation,
  SalesOrder,
  WorkOrder,
} from "./types";
import { invoiceTotals } from "./format";

/** Mutable in-memory store. Swap for DB repository later. */
let data: AppData = structuredClone(seedData);

export function getData(): AppData {
  return data;
}

export function resetDemoData(): void {
  data = structuredClone(seedData);
}

export function getPilotTenant() {
  return data.tenants.find((t) => t.id === PILOT_TENANT_ID)!;
}

export function getTenantProducts(tenantId = PILOT_TENANT_ID) {
  return data.products.filter((p) => p.tenantId === tenantId);
}

export function productById(id: string): Product | undefined {
  return data.products.find((p) => p.id === id);
}

export function dealerById(id: string): Dealer | undefined {
  return data.dealers.find((d) => d.id === id);
}

export function warehouseById(id: string) {
  return data.warehouses.find((w) => w.id === id);
}

export function priceListById(id: string) {
  return data.priceLists.find((p) => p.id === id);
}

export function stockByProduct(tenantId = PILOT_TENANT_ID) {
  return getTenantProducts(tenantId).map((product) => {
    const batches = data.batches.filter(
      (b) => b.tenantId === tenantId && b.productId === product.id,
    );
    const qty = batches.reduce((s, b) => s + b.qtySheets, 0);
    return {
      product,
      qty,
      batches,
      belowReorder: qty < product.reorderLevel,
    };
  });
}

export function stockAlerts(tenantId = PILOT_TENANT_ID) {
  return stockByProduct(tenantId).filter((s) => s.belowReorder);
}

export function openOrders(tenantId = PILOT_TENANT_ID) {
  return data.salesOrders.filter(
    (o) =>
      o.tenantId === tenantId &&
      (o.status === "open" || o.status === "in_progress"),
  );
}

export function scrapMetrics(tenantId = PILOT_TENANT_ID) {
  const completed = data.workOrders.filter(
    (w) =>
      w.tenantId === tenantId &&
      (w.status === "completed" || w.status === "in_progress") &&
      w.inputQtySheets > 0,
  );
  const input = completed.reduce((s, w) => s + w.inputQtySheets, 0);
  const scrap = completed.reduce((s, w) => s + w.scrapQtySheets, 0);
  const good = completed.reduce((s, w) => s + w.goodQtySheets, 0);
  const scrapPct = input === 0 ? 0 : (scrap / input) * 100;
  const avgYield =
    completed.length === 0
      ? 0
      : completed.reduce((s, w) => s + w.yieldPct, 0) / completed.length;
  return { input, scrap, good, scrapPct, avgYield, workOrders: completed.length };
}

export function arSummary(tenantId = PILOT_TENANT_ID) {
  const invoices = data.invoices.filter((i) => i.tenantId === tenantId);
  return invoices.map((inv) => {
    const { total } = invoiceTotals(inv.lines, inv.taxPct);
    const outstanding = Math.max(0, total - inv.paidPkr);
    return { invoice: inv, total, outstanding };
  });
}

export function convertQuotationToOrder(quotationId: string): SalesOrder | null {
  const qt = data.quotations.find((q) => q.id === quotationId);
  if (!qt || qt.status === "converted") return null;

  const nextNum = data.salesOrders.length + 97;
  const order: SalesOrder = {
    id: `so_demo_${Date.now()}`,
    tenantId: qt.tenantId,
    number: `SO-2026-0${nextNum}`,
    dealerId: qt.dealerId,
    quotationId: qt.id,
    status: "open",
    createdAt: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    productionMode: "cut_from_stock",
    notes: `Converted from ${qt.number}`,
    lines: qt.lines.map((l) => ({ ...l, id: `sol_${l.id}_${Date.now()}` })),
  };

  qt.status = "converted";
  data.salesOrders = [order, ...data.salesOrders];
  return order;
}

export function getQuotation(id: string): Quotation | undefined {
  return data.quotations.find((q) => q.id === id);
}

export function getSalesOrder(id: string): SalesOrder | undefined {
  return data.salesOrders.find((o) => o.id === id);
}

export function getWorkOrder(id: string): WorkOrder | undefined {
  return data.workOrders.find((w) => w.id === id);
}

export function getInvoice(id: string): Invoice | undefined {
  return data.invoices.find((i) => i.id === id);
}

export function salesByDealer(tenantId = PILOT_TENANT_ID) {
  const map = new Map<string, number>();
  for (const so of data.salesOrders.filter((o) => o.tenantId === tenantId)) {
    const total = so.lines.reduce((s, l) => s + l.qtySheets * l.unitPricePkr, 0);
    map.set(so.dealerId, (map.get(so.dealerId) ?? 0) + total);
  }
  return [...map.entries()].map(([dealerId, total]) => ({
    dealer: dealerById(dealerId)!,
    total,
  }));
}
