import { Category, Product, TickerItem } from "@/types";

export const MAIN_API_URL = "https://openapi.programming-hero.com/api/bazardor";
export const BASE_URL_1 = "https://api.api-store.workers.dev/api/bazardor";
export const BASE_URL_2 = "https://api.abcz.workers.dev/api/bazardor";

// ─── Formatters ─────────────────────────────────────────────────────────────

export function toBengaliDigits(value: number | string): string {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value
    .toString()
    .replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

/** টাকা/কেজি style — used in ticker */
export function formatUnitBn(unit: string): string {
  switch (unit?.toLowerCase()) {
    case "kg":      return "টাকা/কেজি";
    case "litre":   return "টাকা/লিটার";
    case "dozen":   return "টাকা/ডজন";
    case "piece":   return "টাকা/টি";
    default:        return "টাকা/একক";
  }
}

/** প্রতি কেজি style — used in product cards */
export function formatCardUnit(unit: string): string {
  switch (unit?.toLowerCase()) {
    case "kg":      return "প্রতি কেজি";
    case "litre":   return "প্রতি লিটার";
    case "dozen":   return "প্রতি ডজন";
    case "piece":   return "প্রতি পিস";
    default:        return `প্রতি ${unit || "একক"}`;
  }
}

/** ১,২৯০ টাকা style — Bengali numerals with comma separator */
export function formatBengaliPrice(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "০ টাকা";
  return `${toBengaliDigits(amount.toLocaleString("en-IN"))} টাকা`;
}

// ─── Fallback Data ──────────────────────────────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "chal",    slug: "chal",    nameBn: "চাল",    icon: "🍚" },
  { id: "dal",     slug: "dal",     nameBn: "ডাল",    icon: "🫘" },
  { id: "tel",     slug: "tel",     nameBn: "তেল",    icon: "🛢️" },
  { id: "sobji",   slug: "sobji",   nameBn: "সবজি",   icon: "🥬" },
  { id: "mach",    slug: "mach",    nameBn: "মাছ",    icon: "🐟" },
  { id: "mangsho", slug: "mangsho", nameBn: "মাংস",   icon: "🍗" },
  { id: "dim-dui", slug: "dim-dui", nameBn: "ডিম-দুধ", icon: "🥛" },
  { id: "mosla",   slug: "mosla",   nameBn: "মসলা",   icon: "🌶️" },
];

export const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  { id: 1,  emoji: "🍚", name: "স্বর্ণমাছি চাল",  price: "১৪৮", unit: "টাকা/কেজি",  change: "২.১%",  trend: "up"   },
  { id: 2,  emoji: "🍚", name: "মিনিকেট চাল",     price: "৯৯",  unit: "টাকা/কেজি",  change: "২.৯%",  trend: "down" },
  { id: 3,  emoji: "🍚", name: "বাটাম সাইজ চাল",  price: "৬৬",  unit: "টাকা/কেজি",  change: "৩.১%",  trend: "up"   },
  { id: 4,  emoji: "🫘", name: "মসুর ডাল",        price: "১৪২", unit: "টাকা/কেজি",  change: "২.৯%",  trend: "up"   },
  { id: 5,  emoji: "🫘", name: "ছোলা",            price: "১২০", unit: "টাকা/কেজি",  change: "২.৪%",  trend: "down" },
  { id: 6,  emoji: "🛢️", name: "সরিষার তেল",      price: "১৯২", unit: "টাকা/লিটার", change: "২.১%",  trend: "up"   },
  { id: 7,  emoji: "🥬", name: "আলু",             price: "৩০",  unit: "টাকা/কেজি",  change: "৬.২%",  trend: "down" },
  { id: 8,  emoji: "🧅", name: "পেঁয়াজ",          price: "৫৪",  unit: "টাকা/কেজি",  change: "১২.৫%", trend: "up"   },
  { id: 9,  emoji: "🌶️", name: "কাঁচামরিচ",       price: "৯২",  unit: "টাকা/কেজি",  change: "১২.৪%", trend: "down" },
  { id: 10, emoji: "🐟", name: "রুই মাছ",         price: "৪৬",  unit: "টাকা/কেজি",  change: "৪.৫%",  trend: "up"   },
  { id: 11, emoji: "🍗", name: "মুরগির মাংস",      price: "২২৫", unit: "টাকা/কেজি",  change: "১.৩%",  trend: "down" },
  { id: 12, emoji: "🥩", name: "গরুর মাংস",       price: "৭৯০", unit: "টাকা/কেজি",  change: "১.২%",  trend: "down" },
  { id: 13, emoji: "🥚", name: "ডিম",             price: "১৫৮", unit: "টাকা/ডজন",   change: "৩.৯%",  trend: "up"   },
  { id: 14, emoji: "🥛", name: "দুধ",             price: "১০২", unit: "টাকা/লিটার", change: "২.০%",  trend: "up"   },
];

// ─── API Fetchers ────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const urls = [
    `${MAIN_API_URL}/categories`,
    `${BASE_URL_1}/categories`,
    `${BASE_URL_2}/categories`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch { /* try next */ }
  }
  return DEFAULT_CATEGORIES;
}

export async function getProducts(): Promise<Product[]> {
  const urls = [
    `${MAIN_API_URL}/products`,
    `${BASE_URL_1}/products`,
    `${BASE_URL_2}/products`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch { /* try next */ }
  }
  return [];
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

export function mapProductsToTickerItems(products: Product[]): TickerItem[] {
  if (!products || products.length === 0) return DEFAULT_TICKER_ITEMS;

  return products.map((product) => {
    const rawPct = Math.abs(product.change?.pct ?? 0);
    const formattedPct = toBengaliDigits(rawPct.toFixed(1)) + "%";
    return {
      id:     product.id,
      emoji:  product.image || product.categoryIcon || "🛒",
      name:   product.nameBn,
      price:  toBengaliDigits(product.today),
      unit:   formatUnitBn(product.unit),
      change: formattedPct,
      trend:  product.change?.dir || "flat",
    };
  });
}
