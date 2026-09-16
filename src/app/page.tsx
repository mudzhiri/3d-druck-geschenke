import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/brand";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
