import Link from "next/link";
import { dashboardStats } from "@/lib/orders/store";
import { marketplaceAdapters } from "@/lib/marketplaces/adapters";
import { formatMoney } from "@/lib/utils";
import { brand } from "@/lib/brand";

export default function AdminHome() {
  const stats = dashboardStats();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-paper">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-lime">{brand.name} Admin</p>
          <h1 className="display text-4xl font-extrabold">Today</h1>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/orders" className="text-lime">Orders</Link>
          <Link href="/admin/production">Production</Link>
          <Link href="/admin/inventory">Inventory</Link>
          <Link href="/admin/channels">Channels</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Revenue", formatMoney(stats.revenueCents)],
          ["Orders", String(stats.orders)],
          ["AOV", formatMoney(stats.aovCents)],
          ["Units", String(stats.unitsSold)],
          ["Queue", String(stats.productionQueued)],
          ["Late", String(stats.lateOrders)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 p-5">
            <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 display text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-muted">Channels</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        {Object.entries(stats.byChannel).map(([ch, cents]) => (
          <div key={ch} className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-muted">{ch}</p>
            <p className="font-semibold">{formatMoney(cents)}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-2 text-sm">
        {marketplaceAdapters.map((a) => (
          <p key={a.id}>
            {a.id}: <span className="text-coral">{a.getStatus()}</span>
          </p>
        ))}
      </div>
    </main>
  );
}
