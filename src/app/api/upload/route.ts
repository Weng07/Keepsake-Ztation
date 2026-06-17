import { NextResponse } from "next/server";
import slugify from "slugify";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceSupabaseClient } from "@/lib/supabase";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

  const formData = await request.formData();
  const file = formData.get("file");
  const bucket = String(formData.get("bucket") || "product-images");
  const folder = String(formData.get("folder") || "uploads");

  if (!(file instanceof File)) return NextResponse.json({ error: "No image file received" }, { status: 400 });
  if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WEBP, and GIF images are allowed" }, { status: 400 });
  if (file.size > maxSize) return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, ""), { lower: true, strict: true });
  const path = `${folder}/${base}-${Date.now()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path, bucket });
}
