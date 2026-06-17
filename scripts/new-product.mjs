#!/usr/bin/env node
import { createInterface } from "readline";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));
const slug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

console.log("\n✦  New Product\n");
const title = await ask("Title: ");
const description = await ask("Short description: ");
const price = await ask("Price (e.g. $25.00): ");
const category = await ask("Category [print/digital/souvenir/sticker/poster/apparel/other]: ");
const tags = await ask("Tags (comma-separated): ");
const downloadable = (await ask("Downloadable? [y/N]: ")).toLowerCase() === "y";
const featured = (await ask("Featured on homepage? [y/N]: ")).toLowerCase() === "y";

const productSlug = slug(title);
const today = new Date().toISOString().split("T")[0];
const tagsArray = tags.split(",").map((t) => `"${t.trim()}"`).join(", ");

const content = `---
title: "${title}"
description: "${description}"
price: "${price}"
category: "${category || "other"}"
tags: [${tagsArray}]
coverImage: "/uploads/"
images: []
featured: ${featured}
available: true
downloadable: ${downloadable}
externalLink: ""
createdAt: "${today}"
updatedAt: "${today}"
---

<!-- Add longer description below in Markdown -->
`;

const filePath = join(process.cwd(), "content", "products", `${productSlug}.md`);
if (existsSync(filePath)) { console.log("\n Already exists:", filePath); process.exit(1); }
writeFileSync(filePath, content);
console.log(`\n Created: content/products/${productSlug}.md`);
rl.close();
