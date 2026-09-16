/**
 * Order-ready STL naming for print floor pickup.
 *
 * Master:  production/stl/masters/{SKU}_MASTER_v1.stl
 * Order:   production/stl/orders/{ORDER_ID}__{SKU}__{COLOR}__{CUSTOM}.stl
 *
 * Example: ORD-2026-000131__PL-NAME-KEY__LIM__ANNA.stl
 */

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";

const ROOT = process.cwd();
export const STL_MASTERS_DIR = path.join(ROOT, "production", "stl", "masters");
export const STL_ORDERS_DIR = path.join(ROOT, "production", "stl", "orders");

export function sanitizeStlToken(value: string, max = 24) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max) || "X";
}

export function masterStlPath(skuBase: string, version = "v1") {
  return path.join(STL_MASTERS_DIR, `${skuBase}_MASTER_${version}.stl`);
}

export function orderStlFileName(input: {
  orderId: string;
  sku: string;
  colorCode?: string;
  personalization?: { name?: string; initials?: string; text?: string };
}) {
  const custom =
    input.personalization?.name ||
    input.personalization?.initials ||
    input.personalization?.text ||
    "STD";
  return [
    sanitizeStlToken(input.orderId, 32),
    sanitizeStlToken(input.sku, 28),
    sanitizeStlToken(input.colorCode || "DEF", 8),
    sanitizeStlToken(custom, 20),
  ].join("__") + ".stl";
}

export function prepareOrderStlFiles(input: {
  orderId: string;
  items: Array<{
    sku: string;
    masterSkuBase: string;
    colorCode?: string;
    personalization?: { name?: string; initials?: string; text?: string };
    fileVersion?: string;
  }>;
}) {
  if (typeof window !== "undefined") {
    return { ok: false as const, files: [] as string[], note: "client" };
  }

  mkdirSync(STL_ORDERS_DIR, { recursive: true });
  const files: string[] = [];

  for (const item of input.items) {
    const version = (item.fileVersion || "v1").replace(/^.*-/, "") || "v1";
    const ver = version.match(/v\d+/)?.[0] || "v1";
    const master = masterStlPath(item.masterSkuBase, ver);
    const outName = orderStlFileName({
      orderId: input.orderId,
      sku: item.sku,
      colorCode: item.colorCode,
      personalization: item.personalization,
    });
    const outPath = path.join(STL_ORDERS_DIR, outName);

    if (existsSync(master)) {
      copyFileSync(master, outPath);
    } else {
      // Fallback marker so print queue still has a findable file
      writeFileSync(
        outPath.replace(/\.stl$/i, ".MISSING.txt"),
        `Master missing: ${master}\nOrder: ${input.orderId}\nSKU: ${item.sku}\n`,
        "utf8",
      );
    }
    files.push(outName);
  }

  // Queue index for humans
  const indexPath = path.join(STL_ORDERS_DIR, `${sanitizeStlToken(input.orderId, 32)}__INDEX.txt`);
  writeFileSync(
    indexPath,
    [
      `ORDER ${input.orderId}`,
      `CREATED ${new Date().toISOString()}`,
      ...files.map((f) => `- ${f}`),
      "",
      "Print tip: sort folder by name — files group by ORDER_ID.",
    ].join("\n"),
    "utf8",
  );

  return { ok: true as const, files, indexPath };
}

/** Extract base SKU without color/size suffix: PL-NAME-KEY-LIM-M → PL-NAME-KEY */
export function skuBaseFromMaster(masterSku: string) {
  const parts = masterSku.split("-");
  // PL + PRODUCT TOKENS (drop last 1-2 if color/size codes)
  if (parts.length <= 3) return masterSku;
  // Keep PL-NAME-KEY style (3 segments) when possible
  return parts.slice(0, 3).join("-");
}
