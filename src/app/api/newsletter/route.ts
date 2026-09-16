import { NextResponse } from "next/server";
import { z } from "zod";
import { getInfoInbox, newsletterAdminEmail, sendEmail } from "@/lib/email/send";
import { sendTemplateEmail } from "@/lib/email/transactional";

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
  const admin = await sendEmail({
    to: getInfoInbox(),
    subject: mail.subject,
    html: mail.html,
    replyTo: parsed.data.email,
  });

  if (!admin.ok) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }

  await sendTemplateEmail({
    to: parsed.data.email,
    template: "newsletter_welcome",
    locale: parsed.data.locale,
    email: parsed.data.email,
  });

  return NextResponse.json({ ok: true, dryRun: admin.dryRun ?? false });
}
