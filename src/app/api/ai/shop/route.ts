import { NextResponse } from "next/server";
import { z } from "zod";
import { runShopAssistant } from "@/lib/ai/shop-assistant";

const schema = z.object({
  message: z.string().min(1).max(1000),
  locale: z.enum(["de", "en", "fr", "es", "it", "zh"]).default("de"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .max(12)
    .optional(),
  authenticatedEmail: z.string().email().optional().nullable(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  try {
    const reply = await runShopAssistant(parsed.data);
    return NextResponse.json(reply);
  } catch (error) {
    console.error("[api/ai/shop]", error);
    return NextResponse.json(
      { error: "Assistant temporarily unavailable" },
      { status: 502 },
    );
  }
}
