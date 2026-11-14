export function pkr(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function num(n: number): string {
  return new Intl.NumberFormat("en-PK").format(n);
}

export function dims(lengthMm: number, widthMm: number, thicknessMm?: number): string {
  const base = `${lengthMm}×${widthMm} mm`;
  return thicknessMm ? `${thicknessMm} mm · ${base}` : base;
}

export function areaM2(lengthMm: number, widthMm: number, qty = 1): number {
  return ((lengthMm * widthMm) / 1_000_000) * qty;
}

export function lineTotal(qty: number, unitPrice: number): number {
  return qty * unitPrice;
}

export function invoiceTotals(lines: { qtySheets: number; unitPricePkr: number }[], taxPct: number) {
  const subtotal = lines.reduce((s, l) => s + l.qtySheets * l.unitPricePkr, 0);
  const tax = Math.round(subtotal * (taxPct / 100));
  return { subtotal, tax, total: subtotal + tax };
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
