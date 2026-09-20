import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { runDailyProductAgent } from "@/lib/products/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }
  const header = req.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";
  const limit = Number(url.searchParams.get("limit") || "20");

  try {
    const result = await runDailyProductAgent({
      force,
      limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 40) : 20,
    });
    // Bust shop/home/product shells so new SKUs are visible immediately.
    revalidatePath("/", "layout");
    revalidatePath("/de/shop");
    revalidatePath("/en/shop");
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Product agent failed",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
