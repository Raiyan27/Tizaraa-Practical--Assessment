"use client";

import { memo, useCallback } from "react";

interface RatingFilterProps {
  selectedRating: number | null;
  ratingCounts: { rating: number; count: number }[];
  onChange: (rating: number | null) => void;
}

const renderStars = (rating: number, filled: boolean = true) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? filled
                ? "text-yellow-400"
                : "text-gray-300"
              : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export const RatingFilter = memo(function RatingFilter({
  selectedRating,
  ratingCounts,
  onChange,
}: RatingFilterProps) {
  const handleClearRating = useCallback(() => onChange(null), [onChange]);
  const handleRatingChange = useCallback(
    (rating: number) => {
      onChange(rating);
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      {/* Clear option */}
      <button
        onClick={handleClearRating}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
          selectedRating === null
            ? "bg-blue-50 border border-blue-200 text-blue-700"
            : "hover:bg-gray-50 text-gray-600"
        }`}
      >
        <span className="text-sm">All Ratings</span>
        <span className="text-xs text-gray-400">
          {ratingCounts.reduce((sum, r) => Math.max(sum, r.count), 0)}
        </span>
      </button>

      {/* Rating options */}
      {ratingCounts.map(({ rating, count }) => (
        <button
          key={rating}
          onClick={() => handleRatingChange(rating)}
          disabled={count === 0}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
            count === 0
              ? "opacity-50 cursor-not-allowed"
              : selectedRating === rating
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2">
            {renderStars(rating)}
            <span className="text-sm text-gray-600">
              {rating !== 5 ? "& Up" : ""}
            </span>
          </div>
          <span
            className={`text-xs ${count === 0 ? "text-gray-300" : "text-gray-400"}`}
          >
            ({count})
          </span>
        </button>
      ))}
    </div>
  );
});
