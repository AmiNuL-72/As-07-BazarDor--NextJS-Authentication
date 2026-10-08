import { Category, Product, TickerItem } from "@/types";

export const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
export const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

export function toBengaliDigits(value: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value.toString().replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
}

export function formatUnitBn(unit: string): string {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "টাকা/কেজি";
    case "litre":
      return "টাকা/লিটার";
    case "dozen":
      return "টাকা/ডজন";
    case "piece":
      return "টাকা/টি";
    default:
      return "টাকা/একক";
  }
}

// Fallback initial data 
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "chal", slug: "chal", nameBn: "চাল", icon: "🍚" },
  { id: "dal", slug: "dal", nameBn: "ডাল", icon: "🫘" },
  { id: "tel", slug: "tel", nameBn: "তেল", icon: "🛢️" },
  { id: "sobji", slug: "sobji", nameBn: "সবজি", icon: "🥬" },
  { id: "mach", slug: "mach", nameBn: "মাছ", icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস", icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla", slug: "mosla", nameBn: "মসলা", icon: "🌶️" },
];

export const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  { id: 1, emoji: "🍚", name: "স্বর্ণমাছি চাল", price: "১৪৮", unit: "টাকা/কেজি", change: "২.১%", trend: "up" },
  { id: 2, emoji: "🍚", name: "মিনিকেট চাল", price: "৯৯", unit: "টাকা/কেজি", change: "২.৯%", trend: "down" },
  { id: 3, emoji: "🍚", name: "বাটাম সাইজ চাল", price: "৬৬", unit: "টাকা/কেজি", change: "৩.১%", trend: "up" },
  { id: 4, emoji: "🫘", name: "মসুর ডাল", price: "১৪২", unit: "টাকা/কেজি", change: "২.৯%", trend: "up" },
  { id: 5, emoji: "🫘", name: "ছোলা", price: "১২০", unit: "টাকা/কেজি", change: "২.৪%", trend: "down" },
  { id: 6, emoji: "🛢️", name: "সরিষার তেল", price: "১৯২", unit: "টাকা/লিটার", change: "২.১%", trend: "up" },
  { id: 7, emoji: "🥬", name: "আলু", price: "৩০", unit: "টাকা/কেজি", change: "৬.২%", trend: "down" },
  { id: 8, emoji: "🧅", name: "পেঁয়াজ", price: "৫৪", unit: "টাকা/কেজি", change: "১২.৫%", trend: "up" },
  { id: 9, emoji: "🌶️", name: "কাঁচামরিচ", price: "৯২", unit: "টাকা/কেজি", change: "১২.৪%", trend: "down" },
  { id: 10, emoji: "🐟", name: "রুই মাছ", price: "৪৬", unit: "টাকা/কেজি", change: "৪.৫%", trend: "up" },
  { id: 11, emoji: "🍗", name: "মুরগির মাংস", price: "২২৫", unit: "টাকা/কেজি", change: "১.৩%", trend: "down" },
  { id: 12, emoji: "🥩", name: "গরুর মাংস", price: "৭৯০", unit: "টাকা/কেজি", change: "১.২%", trend: "down" },
  { id: 13, emoji: "🥚", name: "ডিম", price: "১৫৮", unit: "টাকা/ডজন", change: "৩.৯%", trend: "up" },
  { id: 14, emoji: "🥛", name: "দুধ", price: "১০২", unit: "টাকা/লিটার", change: "২.০%", trend: "up" },
];

/**
 * Fetch categories */
export async function getCategories(): Promise<Category[]> {
  const urls = [`${BASE_URL_1}/categories`, `${BASE_URL_2}/categories`];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // try next url
    }
  }

  return DEFAULT_CATEGORIES;
}

/**
 * Fetch products */
export async function getProducts(): Promise<Product[]> {
  const urls = [`${BASE_URL_1}/products`, `${BASE_URL_2}/products`];

  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // try next url
    }
  }

  return [];
}

/**
 * Convert products */
export function mapProductsToTickerItems(products: Product[]): TickerItem[] {
  if (!products || products.length === 0) {
    return DEFAULT_TICKER_ITEMS;
  }

  return products.map((product) => {
    const rawPct = Math.abs(product.change?.pct ?? 0);
    const formattedPct = toBengaliDigits(rawPct.toFixed(1)) + "%";

    return {
      id: product.id,
      emoji: product.image || product.categoryIcon || "🛒",
      name: product.nameBn,
      price: toBengaliDigits(product.today),
      unit: formatUnitBn(product.unit),
      change: formattedPct,
      trend: product.change?.dir || "flat",
    };
  });
}