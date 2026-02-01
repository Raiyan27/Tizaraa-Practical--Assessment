"use client";

import { useState, memo, useCallback } from "react";
import { FilterOption } from "@/types/filters";

interface MultiSelectFilterProps {
  title: string;
  options: FilterOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  showColors?: boolean;
  maxVisible?: number;
}

export const MultiSelectFilter = memo(function MultiSelectFilter({
  options,
  selectedIds,
  onToggle,
  showColors = false,
  maxVisible = 5,
}: MultiSelectFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = useCallback(() => setShowAll((prev) => !prev), []);

  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;

  return (
    <div className="space-y-2">
      {visibleOptions.map((option) => {
        const isSelected = selectedIds.includes(option.id);

        return (
          <button
            key={option.id}
            onClick={() => onToggle(option.id)}
            disabled={option.count === 0 && !isSelected}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
              option.count === 0 && !isSelected
                ? "opacity-50 cursor-not-allowed"
                : isSelected
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
            }`}
            aria-pressed={isSelected}
            aria-label={`${option.name} filter${isSelected ? ' selected' : ''}, ${option.count} items`}
            type="button"
          >
            <div className="flex items-center gap-3">
              {/* Checkbox */}
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Color swatch */}
              {showColors && option.hex && (
                <div
                  className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: option.hex }}
                />
              )}

              {/* Label */}
              <span
                className={`text-sm ${isSelected ? "text-blue-700 font-medium" : "text-gray-700"}`}
              >
                {option.name}
              </span>
            </div>

            {/* Count */}
            <span
              className={`text-xs ${option.count === 0 ? "text-gray-300" : "text-gray-400"}`}
            >
              ({option.count})
            </span>
          </button>
        );
      })}

      {/* Show More / Less button */}
      {hasMore && (
        <button
          onClick={toggleShowAll}
          className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-md"
          aria-expanded={showAll}
          type="button"
        >
          {showAll ? "Show Less" : `Show ${options.length - maxVisible} More`}
        </button>
      )}
    </div>
  );
});
