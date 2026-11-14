export type Role =
  | "Owner"
  | "Admin"
  | "Sales"
  | "Warehouse"
  | "Production"
  | "Accounts"
  | "Viewer";

export type Material = "XPS" | "EPS" | "PU" | "PET";

export type DocStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "converted"
  | "open"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "partial"
  | "paid"
  | "overdue"
  | "ordered"
  | "received";

export type MovementType =
  | "receipt"
  | "issue"
  | "adjustment"
  | "transfer"
  | "production_in"
  | "production_out"
  | "scrap";

export type ProductionMode = "cut_from_stock" | "make_to_order";

export interface Tenant {
  id: string;
  slug: string;
  legalName: string;
  brandName: string;
  ntn: string;
  strn: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  currency: string;
  primaryColor: string;
  accentColor: string;
  logoText: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  city: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  name: string;
  material: Material;
  thicknessMm: number;
  lengthMm: number;
  widthMm: number;
  densityGrade: string;
  uom: "sheet";
  trackBatch: boolean;
  reorderLevel: number;
  basePricePkr: number;
}

export interface PriceList {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  tier: "A" | "B" | "C" | "Retail";
}

export interface PriceListItem {
  id: string;
  priceListId: string;
  productId: string;
  unitPricePkr: number;
}

export interface Dealer {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  city: string;
  contact: string;
  phone: string;
  priceListId: string;
  creditLimitPkr: number;
  balancePkr: number;
}

export interface BatchLot {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  lotCode: string;
  qtySheets: number;
  receivedAt: string;
  notes?: string;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  at: string;
  warehouseId: string;
  productId: string;
  batchId?: string;
  type: MovementType;
  qtySheets: number;
  refType: string;
  refNo: string;
  note?: string;
}

export interface LineItem {
  id: string;
  productId?: string;
  description: string;
  material?: Material;
  thicknessMm?: number;
  lengthMm: number;
  widthMm: number;
  qtySheets: number;
  unitPricePkr: number;
  isCustomCut: boolean;
  priceOverride?: boolean;
}

export interface Quotation {
  id: string;
  tenantId: string;
  number: string;
  dealerId: string;
  status: DocStatus;
  createdAt: string;
  validUntil: string;
  lines: LineItem[];
  notes?: string;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  number: string;
  dealerId: string;
  quotationId?: string;
  status: DocStatus;
  createdAt: string;
  dueDate: string;
  productionMode: ProductionMode;
  lines: LineItem[];
  notes?: string;
}

export interface CuttingListLine {
  id: string;
  pieceLengthMm: number;
  pieceWidthMm: number;
  qty: number;
  parentProductId: string;
  estimatedScrapPct: number;
}

export interface WorkOrder {
  id: string;
  tenantId: string;
  number: string;
  salesOrderId?: string;
  status: DocStatus;
  mode: ProductionMode;
  warehouseId: string;
  createdAt: string;
  dueDate: string;
  inputProductId: string;
  inputBatchId?: string;
  inputQtySheets: number;
  outputDescription: string;
  goodQtySheets: number;
  scrapQtySheets: number;
  scrapReason?: string;
  yieldPct: number;
  cuttingList: CuttingListLine[];
}

export interface Invoice {
  id: string;
  tenantId: string;
  number: string;
  salesOrderId: string;
  dealerId: string;
  status: DocStatus;
  issuedAt: string;
  dueDate: string;
  lines: LineItem[];
  taxPct: number;
  paidPkr: number;
}

export interface Supplier {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  city: string;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  number: string;
  supplierId: string;
  status: DocStatus;
  orderedAt: string;
  expectedAt: string;
  lines: { productId: string; qtySheets: number; unitCostPkr: number }[];
}

export interface GoodsReceipt {
  id: string;
  tenantId: string;
  number: string;
  purchaseOrderId: string;
  warehouseId: string;
  receivedAt: string;
  lines: { productId: string; batchLotCode: string; qtySheets: number }[];
}

export interface AppData {
  platformName: string;
  tenants: Tenant[];
  users: User[];
  warehouses: Warehouse[];
  products: Product[];
  priceLists: PriceList[];
  priceListItems: PriceListItem[];
  dealers: Dealer[];
  batches: BatchLot[];
  movements: StockMovement[];
  quotations: Quotation[];
  salesOrders: SalesOrder[];
  workOrders: WorkOrder[];
  invoices: Invoice[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];
  roles: Role[];
}
