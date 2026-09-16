import { NextResponse } from "next/server";
import { z } from "zod";
import { getInfoInbox, newsletterAdminEmail, sendEmail } from "@/lib/email/send";

const schema = z.object({
  email: z.string().email().max(200),
  locale: z.enum(["de", "en", "fr", "es", "it", "zh"]).default("de"),
  website: z.string().optional(),
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
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (parsed.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const mail = newsletterAdminEmail(parsed.data);
  const result = await sendEmail({
    to: getInfoInbox(),
    subject: mail.subject,
    html: mail.html,
    replyTo: parsed.data.email,
  });

  if (!result.ok) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, dryRun: result.dryRun ?? false });
}
