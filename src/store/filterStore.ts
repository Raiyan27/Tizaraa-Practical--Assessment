import { create } from "zustand";
import {
  FilterState,
  DEFAULT_FILTERS,
  SortOption,
  PriceRange,
} from "@/types/filters";

interface FilterStoreState extends FilterState {
  setSearchQuery: (query: string) => void;
  setPriceRange: (range: PriceRange) => void;
  setMinRating: (rating: number | null) => void;
  toggleColor: (colorId: string) => void;
  toggleSize: (sizeId: string) => void;
  toggleBrand: (brand: string) => void;
  toggleOrigin: (origin: string) => void;
  toggleCategory: (category: string) => void;
  setSortBy: (sort: SortOption) => void;
  clearFilters: () => void;
  clearFilter: (filterType: keyof FilterState) => void;
  setFiltersFromUrl: (params: URLSearchParams) => void;
  getActiveFilterCount: () => number;
}

export const useFilterStore = create<FilterStoreState>((set, get) => ({
  ...DEFAULT_FILTERS,

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  setPriceRange: (range: PriceRange) => set({ priceRange: range }),

  setMinRating: (rating: number | null) => set({ minRating: rating }),

  toggleColor: (colorId: string) => {
    const { colors } = get();
    if (colors.includes(colorId)) {
      set({ colors: colors.filter((c) => c !== colorId) });
    } else {
      set({ colors: [...colors, colorId] });
    }
  },

  toggleSize: (sizeId: string) => {
    const { sizes } = get();
    if (sizes.includes(sizeId)) {
      set({ sizes: sizes.filter((s) => s !== sizeId) });
    } else {
      set({ sizes: [...sizes, sizeId] });
    }
  },

  toggleBrand: (brand: string) => {
    const { brands } = get();
    if (brands.includes(brand)) {
      set({ brands: brands.filter((b) => b !== brand) });
    } else {
      set({ brands: [...brands, brand] });
    }
  },

  toggleOrigin: (origin: string) => {
    const { origins } = get();
    if (origins.includes(origin)) {
      set({ origins: origins.filter((o) => o !== origin) });
    } else {
      set({ origins: [...origins, origin] });
    }
  },

  toggleCategory: (category: string) => {
    const { categories } = get();
    if (categories.includes(category)) {
      set({ categories: categories.filter((c) => c !== category) });
    } else {
      set({ categories: [...categories, category] });
    }
  },

  setSortBy: (sort: SortOption) => set({ sortBy: sort }),

  clearFilters: () => set({ ...DEFAULT_FILTERS }),

  clearFilter: (filterType: keyof FilterState) => {
    switch (filterType) {
      case "priceRange":
        set({ priceRange: DEFAULT_FILTERS.priceRange });
        break;
      case "minRating":
        set({ minRating: null });
        break;
      case "colors":
        set({ colors: [] });
        break;
      case "sizes":
        set({ sizes: [] });
        break;
      case "brands":
        set({ brands: [] });
        break;
      case "origins":
        set({ origins: [] });
        break;
      case "categories":
        set({ categories: [] });
        break;
      case "searchQuery":
        set({ searchQuery: "" });
        break;
      default:
        break;
    }
  },

  setFiltersFromUrl: (params: URLSearchParams) => {
    const newState: Partial<FilterState> = {};

    const search = params.get("q");
    if (search) newState.searchQuery = search;

    const minPrice = params.get("minPrice");
    const maxPrice = params.get("maxPrice");
    if (minPrice || maxPrice) {
      newState.priceRange = {
        min: minPrice ? parseInt(minPrice) : DEFAULT_FILTERS.priceRange.min,
        max: maxPrice ? parseInt(maxPrice) : DEFAULT_FILTERS.priceRange.max,
      };
    }

    const rating = params.get("rating");
    if (rating) newState.minRating = parseInt(rating);

    const colors = params.get("colors");
    if (colors) newState.colors = colors.split(",");

    const sizes = params.get("sizes");
    if (sizes) newState.sizes = sizes.split(",");

    const brands = params.get("brands");
    if (brands) newState.brands = brands.split(",");

    const origins = params.get("origins");
    if (origins) newState.origins = origins.split(",");

    const categories = params.get("categories");
    if (categories) newState.categories = categories.split(",");

    const sort = params.get("sort") as SortOption | null;
    if (sort) newState.sortBy = sort;

    set(newState);
  },

  getActiveFilterCount: () => {
    const state = get();
    let count = 0;

    if (
      state.priceRange.min !== DEFAULT_FILTERS.priceRange.min ||
      state.priceRange.max !== DEFAULT_FILTERS.priceRange.max
    )
      count++;
    if (state.minRating !== null) count++;
    count += state.colors.length;
    count += state.sizes.length;
    count += state.brands.length;
    count += state.origins.length;
    count += state.categories.length;

    return count;
  },
}));

/**
 * Helper to build URL search params from filter state
 */
export function buildFilterUrl(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.searchQuery) params.set("q", state.searchQuery);
  if (state.priceRange.min !== DEFAULT_FILTERS.priceRange.min) {
    params.set("minPrice", state.priceRange.min.toString());
  }
  if (state.priceRange.max !== DEFAULT_FILTERS.priceRange.max) {
    params.set("maxPrice", state.priceRange.max.toString());
  }
  if (state.minRating !== null)
    params.set("rating", state.minRating.toString());
  if (state.colors.length > 0) params.set("colors", state.colors.join(","));
  if (state.sizes.length > 0) params.set("sizes", state.sizes.join(","));
  if (state.brands.length > 0) params.set("brands", state.brands.join(","));
  if (state.origins.length > 0) params.set("origins", state.origins.join(","));
  if (state.categories.length > 0)
    params.set("categories", state.categories.join(","));
  if (state.sortBy !== "featured") params.set("sort", state.sortBy);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}
