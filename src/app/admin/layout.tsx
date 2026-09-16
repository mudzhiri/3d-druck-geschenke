import type { Metadata } from "next";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Admin · ${brand.name}`,
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-ink text-paper">
      <div className="border-b border-coral/30 bg-coral/10 px-4 py-2 text-center text-xs text-coral">
        Admin MVP — add AUTH gate (ADMIN_EMAILS + Supabase) before production exposure.
      </div>
      {children}
    </div>
  );
}
