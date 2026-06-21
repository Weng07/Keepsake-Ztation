# Future Updates & Resources

This file tracks planned enhancements and how to add them. Product, photo, and blog management already happen entirely through the `/admin` dashboard — the items below are optional next steps, not requirements.

---

## Ready to Add

### Multiple Admin Users

The current setup supports exactly one admin username/password pair, which covers the common case of a single shop owner. If you ever need separate logins for multiple people, the cleanest upgrade path is swapping `src/lib/auth.ts`'s single-credential check for a small user list (still no database required — a JSON file or a few more `.env.local` entries works fine at small scale), or moving to a hosted auth provider like Clerk or Auth.js if you need invites, roles, or password resets.

### Payments / Checkout

Right now, each product's `externalLink` field can point to an Etsy listing, Gumroad page, or any external checkout — already wired up via the admin product form.

To accept payments directly on this site instead:

**Lemon Squeezy** (great for digital downloads):
```bash
npm install @lemonsqueezy/lemonsqueezy.js
```
Add `LEMONSQUEEZY_API_KEY` to `.env.local`. Replace the "Buy Now" link on the product detail page with a button that creates a checkout session.

**Stripe** (physical + digital, more setup):
```bash
npm install stripe @stripe/stripe-js
```
Requires `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY` in `.env.local`, plus a webhook handler for order confirmation.

---

### Image Gallery / Lightbox

```bash
npm install yet-another-react-lightbox
```
Add to the product detail page for a full-screen, swipeable gallery when a product has multiple photos.

---

### Search

```bash
npm install fuse.js
```
Client-side fuzzy search across products and blog posts. Add a search input to the header.

---

### Newsletter Signup

**Resend** + React Email:
```bash
npm install resend react-email
```
Add a signup form to the footer. Store emails or connect to Mailchimp/ConvertKit via their APIs.

---

### Dark Mode

Tailwind CSS v4 supports `@media (prefers-color-scheme: dark)`. Add dark variants to `globals.css` using `@theme dark { ... }`.

---

### SEO Enhancements

- Add `sitemap.ts` to `src/app/` (Next.js generates XML sitemaps automatically)
- Add `robots.ts` to `src/app/`
- Open Graph images: add `opengraph-image.tsx` files per route

---

### Analytics

```bash
npm install @vercel/analytics
```
Add `<Analytics />` to `src/app/layout.tsx`. Free with Vercel hosting.

---

### Internationalization (i18n)

Next.js has built-in i18n routing. Add supported locales to `next.config.ts`:
```ts
i18n: { locales: ["en", "es", "fr"], defaultLocale: "en" }
```

---

### Image Variants on Upload (thumbnails, srcset)

`sharp` is already a dependency (used by Next.js for `next/image` optimization). To also generate explicit thumbnail/preview sizes at upload time instead of relying on on-the-fly optimization, extend `src/app/api/upload/route.ts` to run the uploaded buffer through `sharp().resize(...)` before sending it to Supabase Storage or local disk.

---

## Already Done This Round

For reference, these were previously listed here as "to add" and are now built in:

- ✅ **Admin product upload with photo, price, and description** — `/admin/products/new`, fully integrated upload (no manual file editing)
- ✅ **Admin blog writing** — `/admin/blog/new`, with cover image upload and Markdown editor
- ✅ **Showcase curation** — `/admin/showcase`, pick which products appear on the homepage
- ✅ **Cloud image storage** — Supabase Storage, configured via `.env.local`, with automatic local-disk fallback
- ✅ **Faster page loads** — self-hosted fonts via `next/font`, server-rendered public pages
- ✅ **Admin login protection** — `/admin` and its underlying APIs are locked behind a username/password, enforced in `middleware.ts`
- ✅ **Richer, fuller homepage hero** with a real featured-product visual and a header that stays legible at every scroll position

---

## Dependency Updates

Run regularly:
```bash
npx npm-check-updates -i   # interactive update picker
npm install
npm run type-check
npm run build
```

Key things to keep current:
- `next` — check release notes at nextjs.org/blog
- `tailwindcss` — check the v4 changelog before bumping minor versions
- `@supabase/supabase-js` — actively maintained, safe to update regularly
- `sharp` — image processing; update for security patches

---

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [Lucide Icons](https://lucide.dev/icons/)
- [Lemon Squeezy](https://www.lemonsqueezy.com)
- [Vercel Deployment](https://vercel.com/docs)
