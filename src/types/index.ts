export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  price?: string;
  category: ProductCategory;
  tags: string[];
  images: string[];
  coverImage: string;
  featured: boolean;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  downloadable?: boolean;
  externalLink?: string;
}

export type ProductCategory =
  | "souvenir"
  | "print"
  | "digital"
  | "sticker"
  | "poster"
  | "apparel"
  | "accessory"
  | "other";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  published: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  author: string;
  email: string;
  social: {
    instagram?: string;
    twitter?: string;
    etsy?: string;
    pinterest?: string;
    tiktok?: string;
  };
}
