import type { BlogPost, Product, ProductCategory } from "@/types";

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description?: string | null;
  price?: string | null;
  category?: string | null;
  tags?: string[] | null;
  images?: string[] | null;
  cover_image?: string | null;
  featured?: boolean | null;
  available?: boolean | null;
  messenger_message?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string | null;
  cover_image?: string | null;
  date?: string | null;
  author?: string | null;
  tags?: string[] | null;
  published?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type CommentRow = {
  id: string;
  target_type: "product" | "blog";
  target_slug: string;
  author_name: string;
  author_email?: string | null;
  body: string;
  status: "pending" | "approved" | "hidden";
  created_at: string;
};

export type AnalyticsRow = {
  id: string;
  target_type: "product" | "blog" | "messenger";
  target_slug: string;
  event_type: "view" | "messenger_click";
  count: number;
  updated_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: string;
  updated_at?: string;
};

export function mapProductRow(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description ?? "",
    price: row.price ?? "",
    category: ((row.category as ProductCategory) || "other"),
    tags: row.tags ?? [],
    images: row.images?.length ? row.images : row.cover_image ? [row.cover_image] : [],
    coverImage: row.cover_image ?? row.images?.[0] ?? "",
    featured: Boolean(row.featured),
    available: row.available !== false,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
    downloadable: false,
    externalLink: "",
    messengerMessage: row.messenger_message ?? undefined,
  };
}

export function mapBlogRow(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content ?? "",
    coverImage: row.cover_image ?? "",
    date: row.date ?? row.created_at ?? new Date().toISOString(),
    author: row.author ?? "Keepsake Ztation Studio",
    tags: row.tags ?? [],
    readingTime: "1 min read",
    published: row.published !== false,
  };
}
