export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

export interface Product {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets?: MarketPrice[];
}

export interface TickerItem {
  id: string | number;
  emoji: string;
  name: string;
  price: string;
  unit: string;
  change: string;
  trend: "up" | "down" | "flat" | "neutral";
}

export interface BazarDorDatasetInfo {
  list: string;
  count: number;
  item: string;
  filterExample: string;
  filterableFields: string[];
}

export interface BazarDorIndexResponse {
  namespace: string;
  datasets: {
    categories: BazarDorDatasetInfo;
    products: BazarDorDatasetInfo;
  };
}