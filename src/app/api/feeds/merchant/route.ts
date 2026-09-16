import { NextResponse } from "next/server";
import { buildMerchantFeedTsv } from "@/lib/feeds/merchant";

export async function GET() {
  return new NextResponse(buildMerchantFeedTsv(), {
    headers: {
      "Content-Type": "text/tab-separated-values; charset=utf-8",
      "Cache-Control": "s-maxage=3600",
    },
  });
}
