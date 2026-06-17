# Keepsake Ztation

A luxury-style Next.js 15.5.19 souvenir shop starter with Tailwind CSS v4, local product images, blog content, and a beginner-friendly admin dashboard.

## Getting started

```bash
npm config set registry https://registry.npmjs.org/
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin dashboard

The admin dashboard is available directly at:

```text
http://localhost:3000/admin
```

The Admin link is intentionally hidden from the public header and footer navigation.

From the dashboard, you can:

- Add a new product
- Upload a product photo
- Publish a blog post
- Upload a blog cover image

You do not need to copy image paths back into the source code. When you save from the admin page, the project automatically writes the image and content files.

## Where uploaded content is saved

Product images:

```text
public/uploads/products/
```

Blog images:

```text
public/uploads/blogs/
```

Product content files:

```text
content/products/
```

Blog content files:

```text
content/blog/
```

## Important hosting note

This local file-saving admin system works well for local development and traditional Node/VPS hosting. On serverless hosts like Vercel, uploaded files and Markdown writes may not persist after deployment. For a production public store, connect the dashboard to a database or CMS such as Supabase, Firebase, Sanity, or another persistent backend.

## Tech stack

- Next.js 15.5.19
- React 19
- Tailwind CSS v4
- `@tailwindcss/postcss`
- `@tailwindcss/typography`
- Local Markdown content
- Local image uploads

## Git ignore

The project excludes install/build folders:

```gitignore
node_modules/
.next/
```
