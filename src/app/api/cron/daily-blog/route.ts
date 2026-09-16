import { NextResponse } from "next/server";
import { runDailyBlogAgent } from "@/lib/blog/agent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    // Allow in development without secret
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

  try {
    const result = await runDailyBlogAgent({ force });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Agent failed",
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
