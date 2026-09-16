/**
 * Marketplace adapters — official APIs only.
 * Credentials live in server env; never exposed to the client.
 */

export type ChannelStatus = "NOT_CONNECTED" | "CONNECTED" | "ERROR";

export interface MarketplaceAdapter {
  id: "AMAZON" | "EBAY" | "RETAIL_24_7";
  getStatus(): ChannelStatus;
  syncListings(): Promise<{ ok: boolean; message: string }>;
  syncInventory(): Promise<{ ok: boolean; message: string }>;
  syncOrders(): Promise<{ ok: boolean; message: string }>;
  syncPrices(): Promise<{ ok: boolean; message: string }>;
  pushTracking(): Promise<{ ok: boolean; message: string }>;
  getReturns(): Promise<{ ok: boolean; message: string }>;
}

function disabled(channel: string): Promise<{ ok: boolean; message: string }> {
  return Promise.resolve({
    ok: false,
    message: `${channel}: NOT CONNECTED — configure official API credentials in server secrets.`,
  });
}

export class AmazonMarketplaceAdapter implements MarketplaceAdapter {
  id = "AMAZON" as const;
  getStatus(): ChannelStatus {
    return process.env.AMAZON_SP_API_REFRESH_TOKEN ? "CONNECTED" : "NOT_CONNECTED";
  }
  syncListings() {
    return disabled("AMAZON");
  }
  syncInventory() {
    return disabled("AMAZON");
  }
  syncOrders() {
    return disabled("AMAZON");
  }
  syncPrices() {
    return disabled("AMAZON");
  }
  pushTracking() {
    return disabled("AMAZON");
  }
  getReturns() {
    return disabled("AMAZON");
  }
}

export class EbayMarketplaceAdapter implements MarketplaceAdapter {
  id = "EBAY" as const;
  getStatus(): ChannelStatus {
    return process.env.EBAY_USER_TOKEN ? "CONNECTED" : "NOT_CONNECTED";
  }
  syncListings() {
    return disabled("EBAY");
  }
  syncInventory() {
    return disabled("EBAY");
  }
  syncOrders() {
    return disabled("EBAY");
  }
  syncPrices() {
    return disabled("EBAY");
  }
  pushTracking() {
    return disabled("EBAY");
  }
  getReturns() {
    return disabled("EBAY");
  }
}

export class Retail247Adapter implements MarketplaceAdapter {
  id = "RETAIL_24_7" as const;
  getStatus(): ChannelStatus {
    return process.env.RETAIL_247_API_URL ? "CONNECTED" : "NOT_CONNECTED";
  }
  syncListings() {
    return disabled("RETAIL_24_7");
  }
  syncInventory() {
    return Promise.resolve({
      ok: true,
      message: "Manual/import inventory correction available until TCN/VMMS API verified.",
    });
  }
  syncOrders() {
    return disabled("RETAIL_24_7");
  }
  syncPrices() {
    return disabled("RETAIL_24_7");
  }
  pushTracking() {
    return disabled("RETAIL_24_7");
  }
  getReturns() {
    return disabled("RETAIL_24_7");
  }
}

export const marketplaceAdapters: MarketplaceAdapter[] = [
  new AmazonMarketplaceAdapter(),
  new EbayMarketplaceAdapter(),
  new Retail247Adapter(),
];
