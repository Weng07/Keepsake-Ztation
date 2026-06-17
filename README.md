# Studio Keepsake — Design Portfolio & Shop

A professional showcase site for souvenirs, art prints, and digital products. Built with Next.js 15, TypeScript, and Tailwind CSS v4. Fully file-based — no database required.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

> **VSCode users:** Open the project folder and run `npm install` then `npm run dev` in the integrated terminal (`Ctrl+`` ` or `Cmd+`` `).

---

## Project Structure

```
souvenir-studio/
├── content/
│   ├── blog/           ← Blog posts (Markdown/MDX)
│   └── products/       ← Product listings (Markdown/MDX)
├── public/
│   ├── images/         ← Static site images
│   └── uploads/        ← Your uploaded product photos (via /admin)
├── scripts/
│   ├── new-product.mjs ← CLI: scaffold a new product
│   └── new-blog.mjs    ← CLI: scaffold a new blog post
└── src/
    ├── app/            ← Next.js App Router pages
    │   ├── page.tsx        — Home
    │   ├── products/       — Shop + product detail
    │   ├── blog/           — Journal + post detail
    │   ├── about/          — About page
    │   ├── admin/          — Image uploader + content guide
    │   └── api/upload/     — Upload API route
    ├── components/
    │   ├── layout/     ← Header, Footer
    │   ├── sections/   ← Hero
    │   └── ui/         ← ProductCard, BlogCard, ImageUploader
    ├── lib/            ← Content loaders, utilities, site config
    ├── styles/         ← Global CSS + design tokens
    └── types/          ← TypeScript interfaces
```

---

## Customizing Your Site

### 1. Site Identity

Edit `src/lib/config.ts`:

```ts
export const siteConfig = {
  name: "Your Studio Name",
  tagline: "Your tagline here.",
  description: "Your meta description.",
  author: "Your Name",
  email: "hello@yourstudio.com",
  social: {
    instagram: "https://instagram.com/yourstudio",
    etsy: "https://etsy.com/shop/yourstudio",
  },
};
```

---

## Adding Products

### Option A — CLI (recommended)

```bash
npm run new:product
```

Answer the prompts. A `.md` file is created in `content/products/`.

### Option B — Manual

Create `content/products/my-product.md`:

```markdown
---
title: "Product Name"
description: "Short description shown in cards and search results."
price: "$25.00"
category: "print"
tags: ["art", "print", "wall art"]
coverImage: "/uploads/my-photo.jpg"
images: ["/uploads/my-photo.jpg", "/uploads/detail-shot.jpg"]
featured: true
available: true
downloadable: false
externalLink: "https://etsy.com/listing/..."
createdAt: "2025-01-15"
updatedAt: "2025-01-15"
---

Optional longer description in **Markdown**. Shown on the product detail page.
```

**Category options:** `souvenir` · `print` · `digital` · `sticker` · `poster` · `apparel` · `accessory` · `other`

---

## Writing Blog Posts

### Option A — CLI

```bash
npm run new:blog
```

### Option B — Manual

Create `content/blog/my-post.md`:

```markdown
---
title: "Post Title"
excerpt: "One sentence summary shown in cards."
date: "2025-01-15"
author: "Your Name"
tags: ["design", "process"]
coverImage: "/uploads/cover.jpg"
published: true
---

Your post content in **Markdown**.

## Headings work

So do images, links, bold, italic, lists, and code blocks.
```

> Set `published: false` to keep a draft hidden from the site.

---

## Uploading Images

1. Go to **http://localhost:3000/admin**
2. Drag & drop or click to upload your images
3. Copy the path shown (e.g. `/uploads/my-image-1234567890.jpg`)
4. Paste it into your product or blog content file's `coverImage` field

Images are saved to `public/uploads/` and served instantly.

---

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server (with Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type check |
| `npm run format` | Format code with Prettier |
| `npm run new:product` | Scaffold a new product file |
| `npm run new:blog` | Scaffold a new blog post file |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, featured products, recent posts |
| `/products` | Full product grid with category filter |
| `/products/[slug]` | Product detail page |
| `/blog` | Blog listing |
| `/blog/[slug]` | Individual blog post |
| `/about` | About / contact page |
| `/admin` | Image uploader + content guide |

---

## Deployment

### Vercel (recommended — free)

1. Push to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Deploy — no configuration needed

### Other platforms

Build output is a standard Next.js app. Works on Netlify, Railway, Render, or any Node.js host.

```bash
npm run build    # Build
npm run start    # Serve (requires Node 18+)
```

---

## Design Tokens

Colors, fonts, and spacing are defined in `src/styles/globals.css` under `@theme`. Key values:

| Token | Value | Use |
|---|---|---|
| `--color-ink` | `#0e0e0e` | Background (dark sections) |
| `--color-parchment` | `#faf8f4` | Background (light sections) |
| `--color-gold` | `#c9a84c` | Accent, labels, highlights |
| `--color-mist` | `#f5f3ef` | Light section backgrounds |
| `--font-display` | Cormorant Garamond | Headings |
| `--font-body` | DM Sans | Body copy |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Content | Markdown / MDX + gray-matter |
| Images | next/image (WebP/AVIF auto-optimization) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Date formatting | date-fns |
| Blog rendering | next-mdx-remote |
| Upload handling | Native Next.js API Route |

---

## Future Updates

See `UPDATES.md` for a roadmap of features ready to add (e-commerce, CMS integration, email newsletter, dark mode, etc.).

---

## License

Personal and commercial use permitted. Not for redistribution as a template.
