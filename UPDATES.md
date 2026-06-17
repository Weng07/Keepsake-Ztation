# Future Updates & Resources

This file tracks planned enhancements and how to add them.

---

## Ready to Add

### E-Commerce Integration

**Lemon Squeezy** (digital products, great for downloads):
```bash
npm install @lemonsqueezy/lemonsqueezy.js
```
Add `LEMONSQUEEZY_API_KEY` to `.env.local`. Replace `externalLink` on product pages with a "Buy" button that creates a checkout session.

**Stripe** (physical + digital):
```bash
npm install stripe @stripe/stripe-js
```
Requires a `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`.

**Etsy** — just set `externalLink` to your Etsy listing URL. Already wired up.

---

### CMS Integration (so non-developers can edit content)

**Keystatic** (file-based, free, local or GitHub):
```bash
npm install @keystatic/core @keystatic/next
```
Gives you a visual editor at `/keystatic` that writes to your existing `content/` folder. Zero database needed.

**Contentlayer 2 / Velite** — typed content layer on top of your existing Markdown files. 

---

### Image Gallery / Lightbox

```bash
npm install yet-another-react-lightbox
```
Add to product detail pages for a full-screen swipe-able gallery.

---

### Search

```bash
npm install fuse.js
```
Client-side fuzzy search across products and posts. Add a search input to the header.

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
- `tailwindcss` — v4 is still maturing; check changelog
- `sharp` — image processing; update for security patches

---

## Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [MDX Docs](https://mdxjs.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/icons/)
- [Keystatic CMS](https://keystatic.com)
- [Lemon Squeezy](https://www.lemonsqueezy.com)
- [Vercel Deployment](https://vercel.com/docs)

## Admin publishing update

- Reworked the Admin Dashboard so products and blog posts can be created directly inside the website.
- Product uploads now save the image automatically to `public/uploads/products/` and write a matching Markdown file to `content/products/`.
- Blog uploads now save the cover image automatically to `public/uploads/blogs/` and write a matching Markdown file to `content/blog/`.
- Public Shop and Journal pages now run dynamically so newly saved products/blogs appear after refresh during local development.
- Removed Admin from the public header and footer navigation. The page still exists at `/admin` for direct access.
- Replaced the copy-path workflow with real Save Product and Publish Blog forms.
- Updated `package-lock.json` so package tarballs resolve from the public npm registry instead of the temporary internal registry used during earlier packaging.
