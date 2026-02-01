"use client";

import { useState, useCallback, memo } from "react";
import { FilterCounts, FilterState } from "@/types/filters";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { RatingFilter } from "./RatingFilter";
import { MultiSelectFilter } from "./MultiSelectFilter";

interface FilterPanelProps {
  filters: FilterState;
  filterCounts: FilterCounts;
  onPriceChange: (range: { min: number; max: number }) => void;
  onRatingChange: (rating: number | null) => void;
  onColorToggle: (colorId: string) => void;
  onSizeToggle: (sizeId: string) => void;
  onBrandToggle: (brand: string) => void;
  onOriginToggle: (origin: string) => void;
  onCategoryToggle: (category: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: number;
}

const FilterSection = memo(function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
  badge,
}: FilterSectionProps) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-md"
        aria-expanded={isOpen}
        aria-controls={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {badge !== undefined && badge > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full" aria-label={`${badge} options available`}>
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className="pb-4 px-1"
          id={`filter-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {children}
        </div>
      )}
    </div>
  );
});

export const FilterPanel = memo(function FilterPanel({
  filters,
  filterCounts,
  onPriceChange,
  onRatingChange,
  onColorToggle,
  onSizeToggle,
  onBrandToggle,
  onOriginToggle,
  onCategoryToggle,
  onClearAll,
  activeFilterCount,
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    rating: true,
    category: true,
    color: true,
    size: false,
    brand: false,
    origin: false,
  });

  const toggleSection = useCallback((section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const isPriceFiltered =
    filters.priceRange.min !== filterCounts.priceRange.min ||
    filters.priceRange.max !== filterCounts.priceRange.max;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-600"
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
          <h2 className="font-semibold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-1">
        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
          badge={isPriceFiltered ? 1 : 0}
        >
          <PriceRangeSlider
            min={filterCounts.priceRange.min}
            max={filterCounts.priceRange.max}
            value={filters.priceRange}
            onChange={onPriceChange}
          />
        </FilterSection>

        {/* Rating */}
        <FilterSection
          title="Customer Rating"
          isOpen={openSections.rating}
          onToggle={() => toggleSection("rating")}
          badge={filters.minRating !== null ? 1 : 0}
        >
          <RatingFilter
            selectedRating={filters.minRating}
            ratingCounts={filterCounts.ratings}
            onChange={onRatingChange}
          />
        </FilterSection>

        {/* Category */}
        {filterCounts.categories.length > 0 && (
          <FilterSection
            title="Category"
            isOpen={openSections.category}
            onToggle={() => toggleSection("category")}
            badge={filters.categories.length}
          >
            <MultiSelectFilter
              title="Category"
              options={filterCounts.categories}
              selectedIds={filters.categories}
              onToggle={onCategoryToggle}
            />
          </FilterSection>
        )}

        {/* Colors */}
        {filterCounts.colors.length > 0 && (
          <FilterSection
            title="Color"
            isOpen={openSections.color}
            onToggle={() => toggleSection("color")}
            badge={filters.colors.length}
          >
            <MultiSelectFilter
              title="Color"
              options={filterCounts.colors}
              selectedIds={filters.colors}
              onToggle={onColorToggle}
              showColors
            />
          </FilterSection>
        )}

        {/* Sizes */}
        {filterCounts.sizes.length > 0 && (
          <FilterSection
            title="Size"
            isOpen={openSections.size}
            onToggle={() => toggleSection("size")}
            badge={filters.sizes.length}
          >
            <MultiSelectFilter
              title="Size"
              options={filterCounts.sizes}
              selectedIds={filters.sizes}
              onToggle={onSizeToggle}
            />
          </FilterSection>
        )}

        {/* Brands */}
        {filterCounts.brands.length > 0 && (
          <FilterSection
            title="Brand"
            isOpen={openSections.brand}
            onToggle={() => toggleSection("brand")}
            badge={filters.brands.length}
          >
            <MultiSelectFilter
              title="Brand"
              options={filterCounts.brands}
              selectedIds={filters.brands}
              onToggle={onBrandToggle}
            />
          </FilterSection>
        )}

        {/* Origin */}
        {filterCounts.origins.length > 0 && (
          <FilterSection
            title="Origin"
            isOpen={openSections.origin}
            onToggle={() => toggleSection("origin")}
            badge={filters.origins.length}
          >
            <MultiSelectFilter
              title="Origin"
              options={filterCounts.origins}
              selectedIds={filters.origins}
              onToggle={onOriginToggle}
            />
          </FilterSection>
        )}
      </div>

      {/* Result Count */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
        <p className="text-sm text-gray-600 text-center">
          <span className="font-semibold text-gray-900">
            {filterCounts.total}
          </span>{" "}
          {filterCounts.total === 1 ? "product" : "products"} found
        </p>
      </div>
    </div>
  );
});
