import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).");
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
