import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), "MMMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    souvenir: "Souvenir",
    print: "Art Print",
    digital: "Digital Download",
    sticker: "Sticker",
    poster: "Poster",
    apparel: "Apparel",
    accessory: "Accessory",
    other: "Other",
  };
  return map[category] ?? category;
}
