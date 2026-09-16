import Link from "next/link";
import { catalog, canActivateProduct, licenses, materialCostCents, contributionMargin } from "@/lib/catalog";
import { formatMoney } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display text-4xl font-extrabold">Products / PIM</h1>
        <Link href="/admin" className="text-sm text-lime">Dashboard</Link>
      </div>
      <div className="mb-6 rounded-xl border border-white/10 p-4 text-sm">
        <p className="font-semibold">Licenses</p>
        {licenses.map((l) => (
          <p key={l.id} className="text-muted">
            {l.id}: {l.title} ({l.type})
          </p>
        ))}
      </div>
      <ul className="space-y-4">
        {catalog.map((p) => {
          const mat = materialCostCents(p.production.grams_required, 2200);
          const margin = contributionMargin({
            salePriceCents: p.variants[0].price_cents,
            materialCents: mat,
            packagingCents: 80,
            marketplaceFeeCents: 0,
            paymentFeeCents: 50,
            shippingSubsidyCents: 0,
            electricityCents: 25,
            laborCents: 200,
          });
          return (
            <li key={p.id} className="rounded-2xl border border-white/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{p.name.en}</p>
                  <p className="text-xs text-muted">
                    {p.status} · {p.compliance.product_class} · {p.compliance.compliance_status}
                  </p>
                  <p className="mt-2 text-sm">
                    Material ~{formatMoney(mat)} · Margin {formatMoney(margin.marginCents)} (
                    {margin.marginPct.toFixed(1)}%)
                  </p>
                  <p className="text-xs text-muted">
                    Margin / print hour:{" "}
                    {formatMoney(
                      Math.round(
                        (margin.marginCents / Math.max(p.production.estimated_print_minutes, 1)) *
                          60,
                      ),
                    )}
                  </p>
                </div>
                <p className={canActivateProduct(p) ? "text-lime" : "text-coral"}>
                  {canActivateProduct(p) ? "Can activate" : "Activation blocked"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
