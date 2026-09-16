import { NextResponse } from "next/server";
import { marketplaceAdapters } from "@/lib/marketplaces/adapters";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (const adapter of marketplaceAdapters) {
    results.push({
      channel: adapter.id,
      status: adapter.getStatus(),
      inventory: await adapter.syncInventory(),
    });
  }

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    results,
    notes: [
      "Daily inventory reconciliation stub",
      "Broken link check — wire next",
      "Order audit — wire next",
    ],
  });
}
