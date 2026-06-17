import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Product } from "@/types";

const PRODUCTS_DIR = path.join(process.cwd(), "content/products");

export function getAllProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  const files = fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const products = files.map((file) => {
    const raw = fs.readFileSync(path.join(PRODUCTS_DIR, file), "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");
    return { ...data, slug } as Product;
  });

  return products
    .filter((p) => p.available !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getProductBySlug(slug: string): Product | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  const mdxPath = path.join(PRODUCTS_DIR, `${slug}.mdx`);
  const target = fs.existsSync(mdxPath) ? mdxPath : filePath;

  if (!fs.existsSync(target)) return null;

  const raw = fs.readFileSync(target, "utf-8");
  const { data, content } = matter(raw);
  return { ...data, slug, longDescription: content } as Product;
}

export function getProductsByCategory(category: string): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getCategories(): string[] {
  const products = getAllProducts();
  return [...new Set(products.map((p) => p.category))];
}
