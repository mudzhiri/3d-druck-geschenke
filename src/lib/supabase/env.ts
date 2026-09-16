export function getSupabasePublicEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return { supabaseUrl, supabaseAnonKey };
}

export function isSupabaseConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getSupabasePublicEnv();
  return Boolean(supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes("[SENSITIVE]"));
}
