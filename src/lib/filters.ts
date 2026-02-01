import { Product } from "@/types/product";
import { FilterState, FilterCounts, FilterOption } from "@/types/filters";

/**
 * Get all unique values for filter options from products
 */
export function getFilterOptions(products: Product[]): FilterCounts {
  const colorsMap = new Map<
    string,
    { name: string; hex?: string; count: number }
  >();
  const sizesMap = new Map<string, { name: string; count: number }>();
  const brandsMap = new Map<string, number>();
  const originsMap = new Map<string, number>();
  const categoriesMap = new Map<string, number>();

  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((product) => {
    // Track price range
    if (product.basePrice < minPrice) minPrice = product.basePrice;
    if (product.basePrice > maxPrice) maxPrice = product.basePrice;

    // Count colors across all products
    product.variants.colors.forEach((color) => {
      const existing = colorsMap.get(color.id);
      if (existing) {
        existing.count++;
      } else {
        colorsMap.set(color.id, { name: color.name, hex: color.hex, count: 1 });
      }
    });

    // Count sizes
    product.variants.sizes.forEach((size) => {
      const existing = sizesMap.get(size.id);
      if (existing) {
        existing.count++;
      } else {
        sizesMap.set(size.id, { name: size.name, count: 1 });
      }
    });

    // Count brands
    if (product.brand) {
      brandsMap.set(product.brand, (brandsMap.get(product.brand) || 0) + 1);
    }

    // Count origins
    if (product.origin) {
      originsMap.set(product.origin, (originsMap.get(product.origin) || 0) + 1);
    }

    // Count categories
    if (product.category) {
      categoriesMap.set(
        product.category,
        (categoriesMap.get(product.category) || 0) + 1,
      );
    }
  });

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: products.filter((p) => p.rating >= rating).length,
  }));

  // Convert maps to arrays
  const colors: FilterOption[] = Array.from(colorsMap.entries()).map(
    ([id, data]) => ({
      id,
      name: data.name,
      hex: data.hex,
      count: data.count,
    }),
  );

  const sizes: FilterOption[] = Array.from(sizesMap.entries()).map(
    ([id, data]) => ({
      id,
      name: data.name,
      count: data.count,
    }),
  );

  const brands: FilterOption[] = Array.from(brandsMap.entries()).map(
    ([name, count]) => ({
      id: name,
      name,
      count,
    }),
  );

  const origins: FilterOption[] = Array.from(originsMap.entries()).map(
    ([name, count]) => ({
      id: name,
      name,
      count,
    }),
  );

  const categories: FilterOption[] = Array.from(categoriesMap.entries()).map(
    ([name, count]) => ({
      id: name,
      name,
      count,
    }),
  );

  return {
    colors: colors.sort((a, b) => b.count - a.count),
    sizes: sizes.sort((a, b) => a.name.localeCompare(b.name)),
    brands: brands.sort((a, b) => b.count - a.count),
    origins: origins.sort((a, b) => b.count - a.count),
    categories: categories.sort((a, b) => b.count - a.count),
    ratings: ratingCounts,
    priceRange: {
      min: minPrice === Infinity ? 0 : Math.floor(minPrice),
      max: Math.ceil(maxPrice),
    },
    total: products.length,
  };
}

/**
 * Filter products based on current filter state
 */
export function filterProducts(
  products: Product[],
  filters: FilterState,
): Product[] {
  return products.filter((product) => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Price range filter
    if (
      product.basePrice < filters.priceRange.min ||
      product.basePrice > filters.priceRange.max
    ) {
      return false;
    }

    // Rating filter
    if (filters.minRating !== null && product.rating < filters.minRating) {
      return false;
    }

    // Color filter (product must have at least one selected color)
    if (filters.colors.length > 0) {
      const hasColor = product.variants.colors.some((c) =>
        filters.colors.includes(c.id),
      );
      if (!hasColor) return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasSize = product.variants.sizes.some((s) =>
        filters.sizes.includes(s.id),
      );
      if (!hasSize) return false;
    }

    // Brand filter
    if (filters.brands.length > 0) {
      if (!product.brand || !filters.brands.includes(product.brand)) {
        return false;
      }
    }

    // Origin filter
    if (filters.origins.length > 0) {
      if (!product.origin || !filters.origins.includes(product.origin)) {
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!product.category || !filters.categories.includes(product.category)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort products based on sort option
 */
export function sortProducts(
  products: Product[],
  sortBy: FilterState["sortBy"],
): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case "price-desc":
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    case "featured":
    default:
      // Featured = combination of rating and review count
      return sorted.sort((a, b) => {
        const scoreA = a.rating * Math.log(a.reviewCount + 1);
        const scoreB = b.rating * Math.log(b.reviewCount + 1);
        return scoreB - scoreA;
      });
  }
}

/**
 * Get filter counts for current filtered products
 * This shows how many products match each filter option
 */
export function getFilterCountsForResults(
  allProducts: Product[],
  currentFilters: FilterState,
  filteredProducts: Product[],
): FilterCounts {
  // For each filter type, we need to show how many products would match
  // if that specific filter option was selected (considering other active filters)

  const baseOptions = getFilterOptions(allProducts);

  // Calculate counts for each color (with other filters applied)
  const colorCounts = baseOptions.colors.map((option) => {
    // Apply all filters except current color filter
    const filtersWithoutCurrentColors = {
      ...currentFilters,
      colors: [],
    };
    const productsWithoutColorFilter = filterProducts(
      allProducts,
      filtersWithoutCurrentColors,
    );
    const count = productsWithoutColorFilter.filter((p) =>
      p.variants.colors.some((c) => c.id === option.id),
    ).length;

    return { ...option, count };
  });

  // Calculate counts for each size
  const sizeCounts = baseOptions.sizes.map((option) => {
    const filtersWithoutCurrentSizes = {
      ...currentFilters,
      sizes: [],
    };
    const productsWithoutSizeFilter = filterProducts(
      allProducts,
      filtersWithoutCurrentSizes,
    );
    const count = productsWithoutSizeFilter.filter((p) =>
      p.variants.sizes.some((s) => s.id === option.id),
    ).length;

    return { ...option, count };
  });

  // Calculate counts for each brand
  const brandCounts = baseOptions.brands.map((option) => {
    const filtersWithoutCurrentBrands = {
      ...currentFilters,
      brands: [],
    };
    const productsWithoutBrandFilter = filterProducts(
      allProducts,
      filtersWithoutCurrentBrands,
    );
    const count = productsWithoutBrandFilter.filter(
      (p) => p.brand === option.id,
    ).length;

    return { ...option, count };
  });

  // Calculate counts for each origin
  const originCounts = baseOptions.origins.map((option) => {
    const filtersWithoutCurrentOrigins = {
      ...currentFilters,
      origins: [],
    };
    const productsWithoutOriginFilter = filterProducts(
      allProducts,
      filtersWithoutCurrentOrigins,
    );
    const count = productsWithoutOriginFilter.filter(
      (p) => p.origin === option.id,
    ).length;

    return { ...option, count };
  });

  // Calculate counts for each category
  const categoryCounts = baseOptions.categories.map((option) => {
    const filtersWithoutCurrentCategories = {
      ...currentFilters,
      categories: [],
    };
    const productsWithoutCategoryFilter = filterProducts(
      allProducts,
      filtersWithoutCurrentCategories,
    );
    const count = productsWithoutCategoryFilter.filter(
      (p) => p.category === option.id,
    ).length;

    return { ...option, count };
  });

  // Rating counts (show how many match at each rating threshold)
  const filtersWithoutRating = { ...currentFilters, minRating: null };
  const productsWithoutRatingFilter = filterProducts(
    allProducts,
    filtersWithoutRating,
  );
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: productsWithoutRatingFilter.filter((p) => p.rating >= rating).length,
  }));

  return {
    colors: colorCounts.filter((c) => c.count > 0),
    sizes: sizeCounts.filter((s) => s.count > 0),
    brands: brandCounts.filter((b) => b.count > 0),
    origins: originCounts.filter((o) => o.count > 0),
    categories: categoryCounts.filter((c) => c.count > 0),
    ratings: ratingCounts,
    priceRange: baseOptions.priceRange,
    total: filteredProducts.length,
  };
}
