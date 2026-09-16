import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";

/** List master STLs + download paths for print floor. */
export async function GET() {
  const items = catalog.map((p) => {
    const sku = p.production.stl_master_sku || p.compliance.product_identifier;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      sku,
      masterFile: `${sku}_MASTER_v1.stl`,
      downloadUrl: `/stl/${sku}_MASTER_v1.stl`,
      category_id: p.category_id,
      subcategory_id: p.subcategory_id,
      personalizable: p.personalizable,
      personalization_fields: p.personalization_fields,
    };
  });
  return NextResponse.json({ count: items.length, items });
}
