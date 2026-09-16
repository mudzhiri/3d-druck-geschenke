import { catalog } from "../catalog";

export type ProductionStatus =
  | "QUEUED"
  | "PRINTING"
  | "POST_PROCESSING"
  | "QC"
  | "PACKING"
  | "READY_TO_SHIP"
  | "SHIPPED";

export type OrderChannel = "SHOP" | "AMAZON" | "EBAY" | "RETAIL_24_7";

export type UnifiedOrder = {
  id: string;
  channel: OrderChannel;
  externalId?: string;
  customer: string;
  email: string;
  items: Array<{
    productId: string;
    variantId: string;
    title: string;
    qty: number;
    personalization?: Record<string, string>;
    mode: "IN_STOCK" | "PRINT_ON_DEMAND";
  }>;
  revenueCents: number;
  payment: "PAID" | "PENDING" | "REFUNDED";
  production: ProductionStatus | "N/A";
  fulfillment: "UNFULFILLED" | "PARTIAL" | "SHIPPED" | "DELIVERED";
  country: string;
  createdAt: string;
  locale: "de" | "en";
};

export type ProductionJob = {
  id: string;
  orderId: string;
  productTitle: string;
  qty: number;
  status: ProductionStatus;
  printer: string;
  material: string;
  color: string;
  grams: number;
  estimatedMinutes: number;
  createdAt: string;
  late: boolean;
};

/** In-memory demo store until Supabase is wired. */
const g = globalThis as unknown as {
  __poploopOrders?: UnifiedOrder[];
  __poploopJobs?: ProductionJob[];
  __poploopSeq?: number;
};

function orders() {
  if (!g.__poploopOrders) g.__poploopOrders = seedOrders();
  return g.__poploopOrders;
}
function jobs() {
  if (!g.__poploopJobs) g.__poploopJobs = seedJobs();
  return g.__poploopJobs;
}
function nextSeq() {
  g.__poploopSeq = (g.__poploopSeq ?? 120) + 1;
  return g.__poploopSeq;
}

function seedOrders(): UnifiedOrder[] {
  const p = catalog[0];
  const v = p.variants[0];
  return [
    {
      id: "ORD-2026-000121",
      channel: "SHOP",
      customer: "Demo Customer",
      email: "demo@example.com",
      items: [
        {
          productId: p.id,
          variantId: v.id,
          title: p.name.en,
          qty: 2,
          personalization: { name: "MIA" },
          mode: "PRINT_ON_DEMAND",
        },
      ],
      revenueCents: 4580,
      payment: "PAID",
      production: "QUEUED",
      fulfillment: "UNFULFILLED",
      country: "DE",
      createdAt: new Date().toISOString(),
      locale: "de",
    },
  ];
}

function seedJobs(): ProductionJob[] {
  const p = catalog[0];
  return [
    {
      id: "JOB-001",
      orderId: "ORD-2026-000121",
      productTitle: p.name.en,
      qty: 2,
      status: "QUEUED",
      printer: p.production.printer_type,
      material: p.production.material,
      color: "Acid Lime",
      grams: p.production.grams_required * 2,
      estimatedMinutes: p.production.estimated_print_minutes * 2,
      createdAt: new Date().toISOString(),
      late: false,
    },
  ];
}

export function listOrders() {
  return [...orders()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listJobs() {
  return [...jobs()];
}

export function createOrderFromCart(input: {
  email: string;
  customer: string;
  locale: "de" | "en";
  country: string;
  items: UnifiedOrder["items"];
  revenueCents: number;
  externalId?: string;
}) {
  const id = `ORD-2026-${String(nextSeq()).padStart(6, "0")}`;
  const needsProduction = input.items.some((i) => i.mode === "PRINT_ON_DEMAND");
  const order: UnifiedOrder = {
    id,
    channel: "SHOP",
    externalId: input.externalId,
    customer: input.customer,
    email: input.email,
    items: input.items,
    revenueCents: input.revenueCents,
    payment: "PAID",
    production: needsProduction ? "QUEUED" : "N/A",
    fulfillment: "UNFULFILLED",
    country: input.country,
    createdAt: new Date().toISOString(),
    locale: input.locale,
  };
  orders().unshift(order);

  for (const item of input.items) {
    if (item.mode !== "PRINT_ON_DEMAND") continue;
    const product = catalog.find((p) => p.id === item.productId);
    const variant = product?.variants.find((v) => v.id === item.variantId);
    if (!product || !variant) continue;
    jobs().unshift({
      id: `JOB-${nextSeq()}`,
      orderId: id,
      productTitle: product.name.en,
      qty: item.qty,
      status: "QUEUED",
      printer: product.production.printer_type,
      material: variant.color.stock_material,
      color: variant.color.color_name,
      grams: product.production.grams_required * item.qty,
      estimatedMinutes: product.production.estimated_print_minutes * item.qty,
      createdAt: new Date().toISOString(),
      late: false,
    });
  }

  return order;
}

export function updateJobStatus(id: string, status: ProductionStatus) {
  const job = jobs().find((j) => j.id === id);
  if (!job) return null;
  job.status = status;
  const order = orders().find((o) => o.id === job.orderId);
  if (order) order.production = status;
  return job;
}

export function dashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const todays = orders().filter((o) => o.createdAt.startsWith(today));
  const revenue = todays.reduce((s, o) => s + o.revenueCents, 0);
  const units = todays.reduce(
    (s, o) => s + o.items.reduce((n, i) => n + i.qty, 0),
    0,
  );
  return {
    revenueCents: revenue,
    orders: todays.length,
    aovCents: todays.length ? Math.round(revenue / todays.length) : 0,
    unitsSold: units,
    productionQueued: jobs().filter((j) => j.status === "QUEUED").length,
    lateOrders: jobs().filter((j) => j.late).length,
    byChannel: {
      SHOP: orders().filter((o) => o.channel === "SHOP").reduce((s, o) => s + o.revenueCents, 0),
      AMAZON: 0,
      EBAY: 0,
      RETAIL_24_7: 0,
    },
  };
}
