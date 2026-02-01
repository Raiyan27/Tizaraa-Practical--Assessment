"use client";

import { memo, useCallback } from "react";
import { FilterState, FilterCounts } from "@/types/filters";
import { FilterPanel } from "./FilterPanel";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MobileFilterDrawer = memo(function MobileFilterDrawer({
  isOpen,
  onClose,
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
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto transform transition-transform duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
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
        </div>

        {/* Filter Panel Content */}
        <div className="p-4">
          <FilterPanel
            filters={filters}
            filterCounts={filterCounts}
            onPriceChange={onPriceChange}
            onRatingChange={onRatingChange}
            onColorToggle={onColorToggle}
            onSizeToggle={onSizeToggle}
            onBrandToggle={onBrandToggle}
            onOriginToggle={onOriginToggle}
            onCategoryToggle={onCategoryToggle}
            onClearAll={onClearAll}
            activeFilterCount={activeFilterCount}
          />
        </div>

        {/* Apply Button (Sticky Footer) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Show {filterCounts.total} Results
          </button>
        </div>
      </div>
    </>
  );
});
