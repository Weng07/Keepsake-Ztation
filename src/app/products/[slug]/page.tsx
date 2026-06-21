import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Tag } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProductBySlug, getAllProducts } from "@/lib/products";
import { categoryLabel } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.title, description: product.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="pt-24 min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <Link href="/products" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted hover:text-gold transition-colors mb-12">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-product relative bg-mist overflow-hidden">
              {product.coverImage ? (
                <Image src={product.coverImage} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-8xl text-faint">✦</span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square relative bg-mist overflow-hidden">
                    <Image src={img} alt={`${product.title} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 self-start">
            <p className="section-label mb-3">{categoryLabel(product.category)}</p>
            <h1 className="font-display text-4xl lg:text-5xl text-ink mb-4">{product.title}</h1>
            {product.price && (
              <p className="text-2xl font-semibold text-ink mb-6">{product.price}</p>
            )}
            <div className="divider-gold mb-6" />
            <p className="text-muted leading-relaxed mb-8">{product.description}</p>

            {product.longDescription?.trim() && (
              <div className="prose prose-sm max-w-none mb-8 text-muted prose-headings:font-display prose-headings:font-normal prose-a:text-gold prose-a:no-underline hover:prose-a:underline">
                <MDXRemote source={product.longDescription} />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {product.externalLink && (
                <a href={product.externalLink} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
                  {product.downloadable ? (
                    <><Download size={16} /> Download</>
                  ) : (
                    <><ExternalLink size={16} /> Buy Now</>
                  )}
                </a>
              )}
              <Link href="/products" className="btn-outline justify-center">
                Continue Browsing
              </Link>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="mt-8 flex items-center gap-2 flex-wrap">
                <Tag size={12} className="text-faint" />
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[10px] tracking-widest uppercase text-faint border border-stone/20 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
