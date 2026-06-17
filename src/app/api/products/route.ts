import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

type ProductCategory = "souvenir" | "print" | "digital" | "sticker" | "poster" | "apparel" | "accessory" | "other";

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const maxSize = 10 * 1024 * 1024;

function safeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `product-${Date.now()}`;
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
  const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), bytes);
  return `/uploads/products/${fileName}`;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const longDescription = String(form.get("longDescription") ?? "").trim();
    const price = String(form.get("price") ?? "").trim();
    const category = (String(form.get("category") ?? "other") || "other") as ProductCategory;
    const tags = String(form.get("tags") ?? "souvenir").trim();
    const featured = form.get("featured") === "on";
    const available = form.get("available") === "on";
    const slug = safeSlug(String(form.get("slug") || title));
    const file = form.get("image") as File | null;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Please choose a product photo." }, { status: 400 });
    }

    const imageUrl = await saveImage(file, slug);
    const today = new Date().toISOString().slice(0, 10);
    const productsDir = path.join(process.cwd(), "content", "products");
    await mkdir(productsDir, { recursive: true });

    const markdown = `---\nid: "${slug}"\ntitle: "${yamlEscape(title)}"\ndescription: "${yamlEscape(description)}"\nprice: "${yamlEscape(price)}"\ncategory: "${yamlEscape(category)}"\ntags: [${tagsToYaml(tags)}]\ncoverImage: "${imageUrl}"\nimages: ["${imageUrl}"]\nfeatured: ${featured}\navailable: ${available}\ndownloadable: false\nexternalLink: ""\ncreatedAt: "${today}"\nupdatedAt: "${today}"\n---\n\n${longDescription || description}\n`;

    const filePath = path.join(productsDir, `${slug}.md`);
    await writeFile(filePath, markdown, "utf-8");

    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);

    return NextResponse.json({ ok: true, message: "Product saved", slug, image: imageUrl, path: `content/products/${slug}.md` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
