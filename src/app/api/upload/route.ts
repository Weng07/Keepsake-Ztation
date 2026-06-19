import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKET,
} from "@/lib/supabase";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 10 * 1024 * 1024;

function buildFileName(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = originalName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${baseName || "image"}-${Date.now()}.${ext}`;
}

export async function POST(req: NextRequest) {
  let file: File | null = null;

  try {
    const formData = await req.formData();
    file = formData.get("file") as File | null;
  } catch (err) {
    console.error("Upload error — could not read form data:", err);
    return NextResponse.json(
      { error: "Could not read the uploaded file. Please try again." },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not allowed. Use JPG, PNG, WebP, GIF, or AVIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const fileName = buildFileName(file.name);

  // ---------------------------------------------------------------------
  // Path 1: Supabase Storage (used automatically once .env.local is set)
  // ---------------------------------------------------------------------
  if (isSupabaseConfigured) {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      // Should not happen given isSupabaseConfigured is true, but guards
      // against a race/misconfiguration rather than crashing the request.
      return NextResponse.json(
        { error: "Storage is not configured correctly. Check your .env.local values." },
        { status: 500 }
      );
    }

    try {
      const bytes = await file.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(fileName, Buffer.from(bytes), {
          contentType: file.type,
          cacheControl: "31536000", // 1 year — uploaded filenames are unique
          upsert: false,
        });

      if (uploadError) {
        // Surface the most common, fixable causes with a clear message
        // instead of a generic 500, since these are almost always a
        // one-line setup mistake rather than a real bug.
        const message = uploadError.message || "";

        if (/bucket not found/i.test(message)) {
          return NextResponse.json(
            {
              error: `Supabase bucket "${SUPABASE_STORAGE_BUCKET}" was not found. Create it in your Supabase dashboard under Storage → New bucket, and make sure it's set to Public.`,
            },
            { status: 500 }
          );
        }

        if (/row-level security|RLS|permission|unauthorized|jwt/i.test(message)) {
          return NextResponse.json(
            {
              error:
                "Supabase rejected the upload due to a permissions error. Make sure SUPABASE_SERVICE_ROLE_KEY in .env.local is the service_role key (not the anon/public key), and that the bucket exists.",
            },
            { status: 500 }
          );
        }

        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { error: `Upload failed: ${message || "Unknown storage error"}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(fileName);

      return NextResponse.json({
        url: publicUrlData.publicUrl,
        name: fileName,
        size: file.size,
        storage: "supabase",
      });
    } catch (err) {
      // Network failures, DNS issues, or an unreachable Supabase project
      // land here. This is also the typical shape of a "getToken()" style
      // failure if a browser/session-based client were used instead of
      // the service-role client — which is why getSupabaseServerClient()
      // never uses session-based auth (see src/lib/supabase.ts).
      console.error("Upload error — Supabase request failed:", err);
      return NextResponse.json(
        {
          error:
            "Could not reach Supabase Storage. Check that SUPABASE_URL in .env.local is correct and that your project is online, then try again.",
        },
        { status: 502 }
      );
    }
  }

  // ---------------------------------------------------------------------
  // Path 2: Local disk fallback (used automatically when Supabase env
  // vars are absent — e.g. fresh clone, before .env.local is added).
  // Note: this path only works for local development. Most production
  // hosts (Vercel, Netlify, etc.) have a read-only or ephemeral
  // filesystem, so uploads here will not persist — configure Supabase
  // before deploying.
  // ---------------------------------------------------------------------
  try {
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      name: fileName,
      size: file.size,
      storage: "local",
    });
  } catch (err) {
    console.error("Upload error — local disk write failed:", err);
    return NextResponse.json(
      {
        error:
          "Could not save the file locally. If this is happening on a deployed site (not your own computer), you need to configure Supabase Storage — see src/lib/supabase.ts for setup steps.",
      },
      { status: 500 }
    );
  }
}
