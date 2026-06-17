import { createPublicSupabaseClient } from "@/lib/supabase";

export async function getSiteSetting(key: string, fallback = ""): Promise<string> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return fallback;
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (error || !data) return fallback;
  return data.value ?? fallback;
}
