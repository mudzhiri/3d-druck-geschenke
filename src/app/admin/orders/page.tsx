import Link from "next/link";
import { listOrders } from "@/lib/orders/store";
import { formatMoney } from "@/lib/utils";

export default function AdminOrdersPage() {
  const orders = listOrders();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display text-4xl font-extrabold">Order Hub</h1>
        <Link href="/admin" className="text-sm text-lime">Dashboard</Link>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Order", "Channel", "Customer", "Items", "Revenue", "Payment", "Production", "Fulfillment", "Date"].map(
                (h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-white/10">
                <td className="px-3 py-3 font-mono text-xs">{o.id}</td>
                <td className="px-3 py-3">{o.channel}</td>
                <td className="px-3 py-3">{o.customer}</td>
                <td className="px-3 py-3">
                  {o.items.map((i) => `${i.qty}× ${i.title}`).join(", ")}
                  {o.items.some((i) => i.personalization) && (
                    <span className="ml-1 text-lime">· personalized</span>
                  )}
                </td>
                <td className="px-3 py-3">{formatMoney(o.revenueCents)}</td>
                <td className="px-3 py-3">{o.payment}</td>
                <td className="px-3 py-3">{o.production}</td>
                <td className="px-3 py-3">{o.fulfillment}</td>
                <td className="px-3 py-3 text-xs text-muted">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
