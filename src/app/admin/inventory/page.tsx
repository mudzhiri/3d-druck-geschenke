import Link from "next/link";
import { catalog } from "@/lib/catalog";

export default function InventoryPage() {
  const rows = catalog.flatMap((p) =>
    p.variants.map((v) => ({
      product: p.name.en,
      sku: v.master_sku,
      physical: v.available_stock,
      reserved: 0,
      available: v.available_stock,
      capacity: v.production_capacity,
      safety: v.safety_stock,
      mode: v.mode,
    })),
  );
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display text-4xl font-extrabold">Inventory</h1>
        <Link href="/admin" className="text-sm text-lime">Dashboard</Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase text-muted">
            <tr>
              {["Master SKU", "Product", "Physical", "Reserved", "Available", "Capacity", "Safety", "Mode"].map(
                (h) => (
                  <th key={h} className="px-3 py-3">{h}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sku} className="border-t border-white/10">
                <td className="px-3 py-3 font-mono text-xs">{r.sku}</td>
                <td className="px-3 py-3">{r.product}</td>
                <td className="px-3 py-3">{r.physical}</td>
                <td className="px-3 py-3">{r.reserved}</td>
                <td className="px-3 py-3">{r.available}</td>
                <td className="px-3 py-3">{r.capacity}</td>
                <td className="px-3 py-3">{r.safety}</td>
                <td className="px-3 py-3">{r.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
