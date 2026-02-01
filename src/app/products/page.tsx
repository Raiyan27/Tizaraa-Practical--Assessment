"use client";

import { useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { useFilterStore, buildFilterUrl } from "@/store/filterStore";
import {
  filterProducts,
  sortProducts,
  getFilterOptions,
  getFilterCountsForResults,
} from "@/lib/filters";
import {
  FilterPanel,
  SearchBar,
  SortSelect,
  ActiveFilters,
  MobileFilterDrawer,
} from "@/components/filters";
import { ProductCard } from "@/components/products/ProductCard";

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cart state
  const { items, loadCartFromStorage } = useCartStore();

  // Filter state
  const {
    searchQuery,
    priceRange,
    minRating,
    colors,
    sizes,
    brands,
    origins,
    categories,
    sortBy,
    setSearchQuery,
    setPriceRange,
    setMinRating,
    toggleColor,
    toggleSize,
    toggleBrand,
    toggleOrigin,
    toggleCategory,
    setSortBy,
    clearFilters,
    setFiltersFromUrl,
    getActiveFilterCount,
  } = useFilterStore();

  // Load cart and initialize filters from URL
  useEffect(() => {
    loadCartFromStorage();
    setFiltersFromUrl(searchParams);
    setIsInitialized(true);
  }, [loadCartFromStorage, searchParams, setFiltersFromUrl]);

  // Get current filter state
  const currentFilters = useMemo(
    () => ({
      searchQuery,
      priceRange,
      minRating,
      colors,
      sizes,
      brands,
      origins,
      categories,
      sortBy,
    }),
    [
      searchQuery,
      priceRange,
      minRating,
      colors,
      sizes,
      brands,
      origins,
      categories,
      sortBy,
    ],
  );

  // Update URL when filters change
  useEffect(() => {
    if (!isInitialized) return;

    const newUrl = `/products${buildFilterUrl(currentFilters)}`;
    const currentUrl = `/products${window.location.search}`;

    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [currentFilters, router, isInitialized]);

  // Get base filter options (for all products)
  const baseFilterOptions = useMemo(() => getFilterOptions(products), []);

  // Filter and sort products
  const filteredProducts = useMemo(
    () => filterProducts(products, currentFilters),
    [currentFilters],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sortBy),
    [filteredProducts, sortBy],
  );

  // Get filter counts based on current selection
  const filterCounts = useMemo(
    () => getFilterCountsForResults(products, currentFilters, filteredProducts),
    [currentFilters, filteredProducts],
  );

  const activeFilterCount = getActiveFilterCount();
  const cartItemCount = items.length;

  // Reset price to base range
  const handleResetPrice = useCallback(() => {
    setPriceRange(baseFilterOptions.priceRange);
  }, [setPriceRange, baseFilterOptions.priceRange]);

  // Clear rating filter
  const handleClearRating = useCallback(() => {
    setMinRating(null);
  }, [setMinRating]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Tizaraa
            </Link>
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="font-medium hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Title & Search */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, brand, or category..."
              />
            </div>
          </div>
        </div>

        {/* Mobile Filter Button & Sort */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {/* Active Filters (Mobile & Desktop) */}
        <ActiveFilters
          filters={currentFilters}
          filterCounts={filterCounts}
          onRemoveColor={toggleColor}
          onRemoveSize={toggleSize}
          onRemoveBrand={toggleBrand}
          onRemoveOrigin={toggleOrigin}
          onRemoveCategory={toggleCategory}
          onRemoveRating={handleClearRating}
          onResetPrice={handleResetPrice}
          onClearAll={clearFilters}
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filter Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={currentFilters}
                filterCounts={filterCounts}
                onPriceChange={setPriceRange}
                onRatingChange={setMinRating}
                onColorToggle={toggleColor}
                onSizeToggle={toggleSize}
                onBrandToggle={toggleBrand}
                onOriginToggle={toggleOrigin}
                onCategoryToggle={toggleCategory}
                onClearAll={clearFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {/* Desktop Sort & Results Count */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {sortedProducts.length}
                </span>{" "}
                results
                {searchQuery && (
                  <span>
                    {" "}
                    for &quot;
                    <span className="font-semibold">{searchQuery}</span>&quot;
                  </span>
                )}
              </p>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query to find what
                  you&apos;re looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={currentFilters}
        filterCounts={filterCounts}
        onPriceChange={setPriceRange}
        onRatingChange={setMinRating}
        onColorToggle={toggleColor}
        onSizeToggle={toggleSize}
        onBrandToggle={toggleBrand}
        onOriginToggle={toggleOrigin}
        onCategoryToggle={toggleCategory}
        onClearAll={clearFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}

function ProductsPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading products...</p>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}
