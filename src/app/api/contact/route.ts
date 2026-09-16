import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contactAdminEmail,
  contactConfirmEmail,
  getInfoInbox,
  sendEmail,
} from "@/lib/email/send";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  topic: z.string().min(2).max(80).default("Allgemein"),
  message: z.string().min(10).max(5000),
  locale: z.enum(["de", "en", "fr", "es", "it", "zh"]).default("de"),
  website: z.string().optional(), // honeypot
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
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  const data = parsed.data;
  if (data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const admin = contactAdminEmail(data);
  const adminResult = await sendEmail({
    to: getInfoInbox(),
    subject: admin.subject,
    html: admin.html,
    replyTo: admin.replyTo,
  });

  if (!adminResult.ok) {
    return NextResponse.json({ error: "Send failed" }, { status: 502 });
  }

  const confirm = contactConfirmEmail({ name: data.name, locale: data.locale });
  await sendEmail({
    to: data.email,
    subject: confirm.subject,
    html: confirm.html,
    replyTo: getInfoInbox(),
  });

  return NextResponse.json({ ok: true, dryRun: adminResult.dryRun ?? false });
}
