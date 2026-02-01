import React, { memo, useCallback } from "react";
import { Button } from "./Button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  isLoading?: boolean;
}

export const QuantitySelector = memo(function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
  isLoading = false,
}: QuantitySelectorProps) {
  const handleDecrement = useCallback(() => {
    if (value > min) {
      onChange(value - 1);
    }
  }, [value, min, onChange]);

  const handleIncrement = useCallback(() => {
    if (value < max) {
      onChange(value + 1);
    }
  }, [value, max, onChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    },
    [min, max, onChange],
  );

  return (
    <div
      className={`inline-flex items-center border border-gray-300 rounded-lg ${className}`}
      role="group"
      aria-label="Quantity selector"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min || isLoading}
        className="px-3 rounded-l-lg rounded-r-none"
        aria-label="Decrease quantity"
        type="button"
      >
        −
      </Button>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={isLoading}
        className="w-16 text-center border-x border-gray-300 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        aria-label="Quantity"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max || isLoading}
        className="px-3 rounded-r-lg rounded-l-none"
        aria-label="Increase quantity"
        type="button"
      >
        +
      </Button>
    </div>
  );
});
