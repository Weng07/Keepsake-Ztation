import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const maxSize = 10 * 1024 * 1024;

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `post-${Date.now()}`;
}

function yamlEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, " ");
}

function tagsToYaml(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => `"${yamlEscape(tag)}"`)
    .join(", ");
}

async function saveImage(file: File, slug: string) {
  if (!allowedTypes.includes(file.type)) throw new Error("Only JPG, PNG, WebP, GIF, and AVIF images are allowed.");
  if (file.size > maxSize) throw new Error("Image is too large. Maximum size is 10 MB.");

  const ext = path.extname(file.name).replace(/[^.a-zA-Z0-9]/g, "") || ".jpg";
  const fileName = `${slug}-${Date.now()}${ext.toLowerCase()}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "blogs");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);
  return `/uploads/blogs/${fileName}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") ?? "").trim();
    const excerpt = String(form.get("excerpt") ?? "").trim();
    const content = String(form.get("content") ?? "").trim();
    const author = String(form.get("author") ?? "Keepsake Ztation Studio").trim();
    const tags = String(form.get("tags") ?? "journal").trim();
    const date = String(form.get("date") ?? new Date().toISOString().slice(0, 10));
    const published = form.get("published") === "on";
    const slug = safeSlug(String(form.get("slug") || title));
    const file = form.get("image") as File | null;

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Title, excerpt, and blog body are required." }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Please choose a cover photo." }, { status: 400 });
    }

    const imageUrl = await saveImage(file, slug);
    const blogDir = path.join(process.cwd(), "content", "blog");
    await mkdir(blogDir, { recursive: true });

    const markdown = `---\ntitle: "${yamlEscape(title)}"\nexcerpt: "${yamlEscape(excerpt)}"\ndate: "${yamlEscape(date)}"\nauthor: "${yamlEscape(author)}"\ntags: [${tagsToYaml(tags)}]\ncoverImage: "${imageUrl}"\npublished: ${published}\n---\n\n${content}\n`;

    const filePath = path.join(blogDir, `${slug}.md`);
    await writeFile(filePath, markdown, "utf-8");

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ ok: true, message: "Blog saved", slug, image: imageUrl, path: `content/blog/${slug}.md` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Blog save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
