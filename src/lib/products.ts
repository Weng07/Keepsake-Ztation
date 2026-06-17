import fs from "fs";
import path from "path";
import { parseFrontmatter } from "@/lib/content";
import { createPublicSupabaseClient } from "@/lib/supabase";
import { mapProductRow, type ProductRow } from "@/lib/admin-schema";
import type { Product } from "@/types";

const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

function getMarkdownProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
      const { data } = parseFrontmatter(raw);
      const slug = file.replace(/\.mdx?$/, "");
      return { ...data, slug } as Product;
    })
    .filter((p) => p.available !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function getMarkdownProductBySlug(slug: string): Product | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  const mdxPath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
  const target = fs.existsSync(mdxPath) ? mdxPath : filePath;
  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = parseFrontmatter(raw);
  return { ...data, slug, longDescription: content } as Product;
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return getMarkdownProducts();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("available", true)
    .order("created_at", { ascending: false });

  if (error || !data) return getMarkdownProducts();
  return (data as ProductRow[]).map(mapProductRow);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.featured);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicSupabaseClient();
  if (!supabase) return getMarkdownProductBySlug(slug);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return getMarkdownProductBySlug(slug);
  return mapProductRow(data as ProductRow);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.category === category);
}

export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts();
  return [...new Set(products.map((p) => p.category))];
}
