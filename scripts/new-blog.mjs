#!/usr/bin/env node
import { createInterface } from "readline";
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));
const slug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

console.log("\n✦  New Blog Post\n");
const title = await ask("Title: ");
const excerpt = await ask("Excerpt (one sentence): ");
const author = await ask("Author name: ");
const tags = await ask("Tags (comma-separated): ");

const postSlug = slug(title);
const today = new Date().toISOString().split("T")[0];
const tagsArray = tags.split(",").map((t) => `"${t.trim()}"`).join(", ");

const content = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${today}"
author: "${author}"
tags: [${tagsArray}]
coverImage: ""
published: false
---

<!-- Write your post in Markdown below. Set published: true when ready. -->

Your content here...
`;

const filePath = join(process.cwd(), "content", "blog", `${postSlug}.md`);
if (existsSync(filePath)) { console.log("\n Already exists:", filePath); process.exit(1); }
writeFileSync(filePath, content);
console.log(`\n Created: content/blog/${postSlug}.md`);
console.log("   Set published: true when ready to publish.\n");
rl.close();
