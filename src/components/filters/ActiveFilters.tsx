"use client";

import { FilterState } from "@/types/filters";

interface ActiveFiltersProps {
  filters: FilterState;
  filterCounts: {
    colors: { id: string; name: string }[];
    sizes: { id: string; name: string }[];
  };
  onRemoveColor: (id: string) => void;
  onRemoveSize: (id: string) => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveOrigin: (origin: string) => void;
  onRemoveCategory: (category: string) => void;
  onRemoveRating: () => void;
  onResetPrice: () => void;
  onClearAll: () => void;
}

interface FilterTagProps {
  label: string;
  onRemove: () => void;
  color?: string;
}

function FilterTag({ label, onRemove, color }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-full">
      {color && (
        <span
          className="w-3 h-3 rounded-full border border-blue-300"
          style={{ backgroundColor: color }}
        />
      )}
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
      >
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

export function ActiveFilters({
  filters,
  filterCounts,
  onRemoveColor,
  onRemoveSize,
  onRemoveBrand,
  onRemoveOrigin,
  onRemoveCategory,
  onRemoveRating,
  onResetPrice,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.colors.length > 0 ||
    filters.sizes.length > 0 ||
    filters.brands.length > 0 ||
    filters.origins.length > 0 ||
    filters.categories.length > 0 ||
    filters.minRating !== null ||
    filters.priceRange.min > 0 ||
    filters.priceRange.max < 1000;

  if (!hasActiveFilters) return null;

  const getColorName = (id: string) =>
    filterCounts.colors.find((c) => c.id === id)?.name || id;
  const getColorHex = (id: string) => {
    const color = filterCounts.colors.find((c) => c.id === id);
    return (color as { hex?: string })?.hex;
  };
  const getSizeName = (id: string) =>
    filterCounts.sizes.find((s) => s.id === id)?.name || id;

  const isPriceFiltered =
    filters.priceRange.min > 0 || filters.priceRange.max < 1000;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-gray-500 mr-1">Active filters:</span>

      {/* Price Range */}
      {isPriceFiltered && (
        <FilterTag
          label={`$${filters.priceRange.min} - $${filters.priceRange.max}`}
          onRemove={onResetPrice}
        />
      )}

      {/* Rating */}
      {filters.minRating !== null && (
        <FilterTag
          label={`${filters.minRating}+ Stars`}
          onRemove={onRemoveRating}
        />
      )}

      {/* Categories */}
      {filters.categories.map((category) => (
        <FilterTag
          key={category}
          label={category}
          onRemove={() => onRemoveCategory(category)}
        />
      ))}

      {/* Colors */}
      {filters.colors.map((colorId) => (
        <FilterTag
          key={colorId}
          label={getColorName(colorId)}
          color={getColorHex(colorId)}
          onRemove={() => onRemoveColor(colorId)}
        />
      ))}

      {/* Sizes */}
      {filters.sizes.map((sizeId) => (
        <FilterTag
          key={sizeId}
          label={getSizeName(sizeId)}
          onRemove={() => onRemoveSize(sizeId)}
        />
      ))}

      {/* Brands */}
      {filters.brands.map((brand) => (
        <FilterTag
          key={brand}
          label={brand}
          onRemove={() => onRemoveBrand(brand)}
        />
      ))}

      {/* Origins */}
      {filters.origins.map((origin) => (
        <FilterTag
          key={origin}
          label={origin}
          onRemove={() => onRemoveOrigin(origin)}
        />
      ))}

      {/* Clear All */}
      <button
        onClick={onClearAll}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-2"
      >
        Clear All
      </button>
    </div>
  );
}
