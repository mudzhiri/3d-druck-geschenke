import Link from "next/link";
import { listJobs } from "@/lib/orders/store";

const columns = ["QUEUED", "PRINTING", "QC", "PACKING", "READY_TO_SHIP"] as const;

export default function ProductionPage() {
  const jobs = listJobs();
  const late = jobs.filter((j) => j.late);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="display text-4xl font-extrabold">Production</h1>
        <Link href="/admin" className="text-sm text-lime">Dashboard</Link>
      </div>
      {late.length > 0 && (
        <p className="mb-4 rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm text-coral">
          Late: {late.length}
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-5">
        {columns.map((status) => (
          <div key={status} className="rounded-2xl border border-white/10 p-3">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">{status}</p>
            <ul className="space-y-3">
              {jobs
                .filter((j) =>
                  status === "QC"
                    ? j.status === "QC" || j.status === "POST_PROCESSING"
                    : j.status === status,
                )
                .map((j) => (
                  <li key={j.id} className="rounded-xl bg-white/5 p-3 text-sm">
                    <p className="font-semibold">{j.orderId}</p>
                    <p className="text-muted">
                      {j.qty}× {j.productTitle}
                    </p>
                    <p className="mt-2 font-mono text-xs text-lime">
                      {Math.floor(j.estimatedMinutes / 60)}h {j.estimatedMinutes % 60}min · {j.material} ·{" "}
                      {j.color} · {j.grams}g
                    </p>
                    <p className="text-xs text-muted">{j.printer}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted">
        Printer distribution hooks ready for Bambu / Prusa / Klipper — no remote control without secure official integration.
      </p>
    </main>
  );
}
