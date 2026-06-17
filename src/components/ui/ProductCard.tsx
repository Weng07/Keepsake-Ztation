import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { categoryLabel } from "@/lib/utils";
import { Download } from "lucide-react";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.slug}`} className="group block" aria-label={product.title}>
      <div className="card-hover bg-ivory overflow-hidden">
        <div className="aspect-product relative overflow-hidden bg-mist">
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-mist">
              <span className="text-faint font-display text-4xl">✦</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {product.featured && (
              <span className="px-2 py-0.5 bg-gold text-ink text-[10px] font-semibold tracking-widest uppercase">
                Featured
              </span>
            )}
            {product.downloadable && (
              <span className="px-2 py-0.5 bg-ink/80 text-gold text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1">
                <Download size={9} /> Digital
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <p className="section-label mb-1">{categoryLabel(product.category)}</p>
          <h3 className="font-display text-lg text-ink leading-tight mb-1 group-hover:text-gold transition-colors duration-200">
            {product.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mb-3">{product.description}</p>
          {product.price && (
            <p className="text-sm font-semibold text-ink">{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
