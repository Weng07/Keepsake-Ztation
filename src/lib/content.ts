type Frontmatter = Record<string, string | string[] | boolean>;

function parseValue(value: string): string | string[] | boolean {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    return trimmed
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^['\"]|['\"]$/g, ""))
      .filter(Boolean);
  }
  return trimmed.replace(/^['\"]|['\"]$/g, "");
}

export function parseFrontmatter(raw: string): { data: Frontmatter; content: string } {
  if (!raw.startsWith("---")) return { data: {}, content: raw.trim() };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { data: {}, content: raw.trim() };

  const frontmatter = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).trim();
  const data: Frontmatter = {};

  for (const line of frontmatter.split("\n")) {
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    data[key] = parseValue(value);
  }

  return { data, content };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function markdownToHtml(markdown: string): string {
  const blocks = markdown.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  return blocks
    .map((block) => {
      if (block.startsWith("## ")) return `<h2>${escapeHtml(block.slice(3))}</h2>`;
      if (block.startsWith("### ")) return `<h3>${escapeHtml(block.slice(4))}</h3>`;
      if (block === "---") return "<hr />";
      return `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}
