import { NextResponse } from "next/server";
import { z } from "zod";
import { sendWelcomeEmail } from "@/lib/email/transactional";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const result = await sendWelcomeEmail({
    to: parsed.data.email,
    name: parsed.data.name,
    locale: parsed.data.locale,
  });

  return NextResponse.json({ ok: result.ok, dryRun: "dryRun" in result ? result.dryRun : false });
}
