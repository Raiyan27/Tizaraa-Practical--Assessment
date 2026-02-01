export type SortOption = 'price-low' | 'price-high' | 'newest' | 'rating' | 'popular';

export interface FilterState {
  search: string;
  priceRange: [number, number];
  minRating: number;
  colors: string[];
  sizes: string[];
  brands: string[];
  origins: string[];
  sort: SortOption;
}

export interface FilterOption {
  id: string;
  label: string;
  count: number;
}
