import Link from "next/link";
import { marketplaceAdapters } from "@/lib/marketplaces/adapters";

export default function ChannelsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display text-4xl font-extrabold">Channels</h1>
        <Link href="/admin" className="text-sm text-lime">Dashboard</Link>
      </div>
      <ul className="space-y-4">
        {marketplaceAdapters.map((a) => (
          <li key={a.id} className="rounded-2xl border border-white/10 p-5">
            <p className="font-bold">{a.id}</p>
            <p className="mt-1 text-coral">{a.getStatus()}</p>
            <p className="mt-3 text-sm text-muted">
              {a.id === "AMAZON" &&
                "Setup: create SP-API app, store LWA credentials in server secrets, enable orders/inventory scopes. Never put tokens in the frontend."}
              {a.id === "EBAY" &&
                "Setup: eBay Inventory API + OAuth user token in secrets. Seller-defined SKU = MASTER SKU."}
              {a.id === "RETAIL_24_7" &&
                "Setup: verify TCN/VMMS API before live sync. Manual import correction available."}
            </p>
            <p className="mt-2 text-xs text-muted">
              Publish workflow: DRAFT → REVIEW → PUBLISH. No auto-publish until proven.
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
