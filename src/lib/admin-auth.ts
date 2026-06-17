import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase";

export async function requireAdmin(request: Request) {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return { error: NextResponse.json({ error: "Supabase is not configured" }, { status: 500 }) };

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return { error: NextResponse.json({ error: "Missing admin session" }, { status: 401 }) };

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: NextResponse.json({ error: "Invalid admin session" }, { status: 401 }) };

  return { user: data.user };
}
