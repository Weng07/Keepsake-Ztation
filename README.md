# Keepsake Ztation

A polished Next.js 15.5.19 souvenir shop starter with Tailwind CSS v4, local product imagery, product/blog Markdown content, and a beginner-friendly admin dashboard.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Tech stack

- Next.js 15.5.19
- React 19
- Tailwind CSS v4
- `@tailwindcss/postcss`
- `@tailwindcss/typography`
- Local Markdown content files
- Local images in `public/images/`

## Tailwind v4 setup

`postcss.config.mjs` is configured for Tailwind v4:

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

The global stylesheet uses:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
```

## Editing product images

Sample product images live here:

```txt
public/images/products/
```

To replace a product image, either replace the JPG file with your own image using the same filename, or update the image path in the matching Markdown file inside:

```txt
content/products/
```

Example:

```yaml
coverImage: "/images/products/mug.jpg"
images: ["/images/products/mug.jpg"]
```

The product image source guide is also commented in `src/lib/products.ts`.

## Admin dashboard

Visit:

```txt
/admin
```

The dashboard includes:

- Image upload area
- Product Markdown builder
- Blog Markdown builder
- Copy-ready beginner templates
- Clear instructions for where uploaded images and content files go

Uploads are saved to:

```txt
public/uploads/
```

Uploaded files are served from:

```txt
/uploads/filename.jpg
```

## Content folders

```txt
content/products/   Product Markdown files
content/blog/       Blog Markdown files
public/images/      Local sample images
public/uploads/     Uploaded admin images
```

## Notes

- `node_modules/` and `.next/` are intentionally ignored and not included in the ZIP.
- Social links are safely defined in `src/lib/config.ts`, including `instagram`, `facebook`, and `tiktok`, so the footer no longer throws a missing social property error.
