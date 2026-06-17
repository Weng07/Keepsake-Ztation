import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/sections/Hero";
import ProductCard from "@/components/ui/ProductCard";
import BlogCard from "@/components/ui/BlogCard";
import { getFeaturedProducts } from "@/lib/products";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";

export default async function HomePage() {
  const featured = (await getFeaturedProducts()).slice(0, 3);
  const recentPosts = (await getAllPosts()).slice(0, 2);

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <section className="py-24 bg-parchment">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Featured</p>
              <h2 className="font-display text-4xl lg:text-5xl text-ink">
                Selected Works
              </h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted hover:text-gold transition-colors group">
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-ivory">
              <p className="font-display text-3xl text-ink mb-3">Coming Soon</p>
              <p className="text-muted text-sm">Products are being added. Check back soon.</p>
            </div>
          )}

          <div className="mt-10 sm:hidden text-center">
            <Link href="/products" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Strip */}
      <section className="py-20 bg-ink">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                number: "01",
                title: "Intentional Design",
                body: "Every piece begins with a question: what feeling should this leave behind?",
              },
              {
                number: "02",
                title: "Made to Last",
                body: "Quality materials and thoughtful production mean your keepsake endures.",
              },
              {
                number: "03",
                title: "Digital & Physical",
                body: "From instant downloads to handcrafted objects — we span both worlds.",
              },
            ].map((item) => (
              <div key={item.number}>
                <p className="font-display text-gold/40 text-5xl mb-4">{item.number}</p>
                <h3 className="font-display text-xl text-mist mb-3">{item.title}</h3>
                <p className="text-sm text-mist/50 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Preview */}
      {recentPosts.length > 0 && (
        <section className="py-24 bg-mist">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-label mb-3">Journal</p>
                <h2 className="font-display text-4xl lg:text-5xl text-ink">
                  From the Studio
                </h2>
              </div>
              <Link href="/blog" className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted hover:text-gold transition-colors group">
                All Posts
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-parchment text-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="divider-gold mx-auto mb-8" />
          <h2 className="font-display text-4xl lg:text-5xl text-ink mb-5">
            Something made for you.
          </h2>
          <p className="text-muted text-base mb-8 leading-relaxed">
            {siteConfig.tagline}
          </p>
          <Link href="/products" className="btn-primary">
            Shop the Collection
          </Link>
        </div>
      </section>
    </>
  );
}
