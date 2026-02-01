export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  priceRange: PriceRange;
  minRating: number | null; // null means no filter
  colors: string[];
  sizes: string[];
  brands: string[];
  origins: string[];
  categories: string[];
  searchQuery: string;
  sortBy: SortOption;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest";

export interface FilterOption {
  id: string;
  name: string;
  count: number;
  hex?: string; // For color options
}

export interface FilterCounts {
  colors: FilterOption[];
  sizes: FilterOption[];
  brands: FilterOption[];
  origins: FilterOption[];
  categories: FilterOption[];
  ratings: { rating: number; count: number }[];
  priceRange: PriceRange;
  total: number;
}

export const DEFAULT_FILTERS: FilterState = {
  priceRange: { min: 0, max: 1000 },
  minRating: null,
  colors: [],
  sizes: [],
  brands: [],
  origins: [],
  categories: [],
  searchQuery: "",
  sortBy: "featured",
};
