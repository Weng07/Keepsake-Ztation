import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, Instagram } from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Studio Keepsake.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen bg-parchment">
      {/* Hero */}
      <section className="py-20 bg-ink">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-6">About</p>
          <h1 className="font-display text-6xl lg:text-7xl text-mist max-w-2xl leading-tight">
            Made with care,<br />
            <em className="not-italic text-gold">meant to stay.</em>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="section-label mb-4">The Story</p>
              <h2 className="font-display text-4xl text-ink mb-6">
                Why we design what we design
              </h2>
              <div className="space-y-4 text-muted leading-relaxed">
                <p>
                  {siteConfig.name} was born from a simple belief: the things we keep
                  say something about who we are. A well-designed souvenir isn't just
                  a token — it's a miniature story, a preserved moment, something that
                  earns its place on a shelf.
                </p>
                <p>
                  Every piece in our collection starts with intention. We ask what
                  feeling it should carry, what material is right for it, and whether
                  it has something genuinely worth saying. If it doesn't pass that
                  test, we don't make it.
                </p>
                <p>
                  We work across both physical and digital goods — prints, objects,
                  downloadable files — because the medium should serve the idea,
                  not the other way around.
                </p>
              </div>
            </div>

            <div className="bg-ink p-10 lg:p-14">
              <p className="font-display text-3xl text-mist mb-8 leading-snug">
                &ldquo;A keepsake only works<br />if it was worth keeping.&rdquo;
              </p>
              <p className="text-gold text-sm">— {siteConfig.author}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-mist">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-10 text-center">What guides us</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Originality", body: "Every design is made from scratch. We don't repurpose templates or follow trends — we follow ideas." },
              { title: "Honesty", body: "Clear descriptions, fair pricing, and no inflated claims. You know exactly what you're getting." },
              { title: "Durability", body: "Physical pieces use quality materials. Digital files are high-resolution and built to last." },
            ].map((v) => (
              <div key={v.title} className="bg-ivory p-8">
                <div className="divider-gold mb-5" />
                <h3 className="font-display text-2xl text-ink mb-3">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <p className="section-label mb-4">Get in touch</p>
          <h2 className="font-display text-4xl text-ink mb-6">Say hello</h2>
          <p className="text-muted max-w-md mx-auto mb-10">
            For commissions, questions, wholesale inquiries, or just to connect —
            we'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`mailto:${siteConfig.email}`} className="btn-primary">
              <Mail size={16} /> {siteConfig.email}
            </a>
            {siteConfig.social.instagram && (
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-outline">
                <Instagram size={16} /> Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Shop CTA */}
      <section className="py-16 bg-ink text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-display text-3xl text-mist mb-4">Ready to explore?</h2>
          <Link href="/products" className="btn-primary group inline-flex">
            Shop the Collection
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
