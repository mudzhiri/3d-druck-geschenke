"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { brand, type Locale } from "@/lib/brand";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import type { AssistantReply } from "@/lib/ai/shop-assistant";

export function ChatAssistant({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string; products?: AssistantReply["products"] }>
  >([]);

  useEffect(() => {
    if (open) track("AI_assistant_open");
  }, [open]);

  async function send() {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");
    const nextMessages = [...messages, { role: "user" as const, text: userText }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const history = nextMessages.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.text,
      }));
      const res = await fetch("/api/ai/shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, locale, history }),
      });
      const data = (await res.json()) as AssistantReply & { error?: string };
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: t(locale, "assistant_offline"),
          },
        ]);
        return;
      }
      if (data.products?.length) track("AI_product_recommendation", { count: data.products.length });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.followUp ? `${data.text}\n\n${data.followUp}` : data.text,
          products: data.products,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-feast focus-ring fixed bottom-5 right-5 z-50 border-2 border-ink px-4 py-3 text-sm shadow-[4px_4px_0_#0A0A0A]"
      >
        {t(locale, "assistant_open")}
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(70vh,520px)] w-[min(92vw,380px)] flex-col overflow-hidden border-2 border-ink bg-paper shadow-[6px_6px_0_#0A0A0A]">
          <div className="border-b-2 border-ink bg-yellow px-4 py-3">
            <p className="font-extrabold uppercase">{brand.assistantName}</p>
            <p className="text-xs text-ink/70">{t(locale, "assistant_catalog_note")}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted">{t(locale, "assistant_hint")}</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <p
                  className={`inline-block whitespace-pre-line rounded-md px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-yellow font-semibold text-ink" : "border-2 border-ink bg-fog"
                  }`}
                >
                  {m.text}
                </p>
                {m.products && (
                  <div className="mt-2 space-y-2">
                    {m.products.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/${locale}/product/${p.slug}`}
                        className="flex items-center gap-3 border-2 border-ink bg-fog p-2 text-left"
                      >
                        <div className="relative h-12 w-12 overflow-hidden bg-paper">
                          <Image src={p.image} alt="" fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold uppercase">{p.name}</p>
                          <p className="text-xs text-muted">{formatMoney(p.priceCents)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t-2 border-ink p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="focus-ring flex-1 rounded-md border-2 border-ink bg-paper px-3 py-2 text-sm"
              placeholder="Ask…"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-feast px-4 py-2 text-sm disabled:opacity-50"
            >
              Go
            </button>
          </form>
        </div>
      )}
    </>
  );
}
