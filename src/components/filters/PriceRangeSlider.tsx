"use client";

import { useCallback, useEffect, useState, memo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
  formatPrice?: (price: number) => string;
}

export const PriceRangeSlider = memo(function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  formatPrice = (price) => `$${price}`,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>([
    value.min,
    value.max,
  ]);

  // Sync local state with prop changes
  useEffect(() => {
    setLocalValue([value.min, value.max]);
  }, [value.min, value.max]);

  const handleSliderChange = useCallback(
    (val: number | number[]) => {
      if (Array.isArray(val) && val.length === 2) {
        const [newMin, newMax] = val;
        setLocalValue([newMin, newMax]);
        onChange({ min: newMin, max: newMax });
      }
    },
    [onChange],
  );

  const handleMinInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMin = Math.max(
        min,
        Math.min(Number(e.target.value), localValue[1] - 1),
      );
      setLocalValue([newMin, localValue[1]]);
    },
    [min, localValue],
  );

  const handleMaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newMax = Math.min(
        max,
        Math.max(Number(e.target.value), localValue[0] + 1),
      );
      setLocalValue([localValue[0], newMax]);
    },
    [max, localValue],
  );

  const handleMinInputBlur = useCallback(() => {
    onChange({ min: localValue[0], max: localValue[1] });
  }, [onChange, localValue]);

  const handleMaxInputBlur = useCallback(() => {
    onChange({ min: localValue[0], max: localValue[1] });
  }, [onChange, localValue]);

  return (
    <div className="px-1">
      {/* Price Display */}
      <div className="flex items-center justify-between mb-4 text-sm gap-2">
        <div className="flex items-center gap-2">
          <label className="text-gray-500 text-xs">Min:</label>
          <input
            type="number"
            value={localValue[0]}
            onChange={handleMinInputChange}
            onBlur={handleMinInputBlur}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={min}
            max={localValue[1] - 1}
          />
        </div>
        <span className="text-gray-400">—</span>
        <div className="flex items-center gap-2">
          <label className="text-gray-500 text-xs">Max:</label>
          <input
            type="number"
            value={localValue[1]}
            onChange={handleMaxInputChange}
            onBlur={handleMaxInputBlur}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            min={localValue[0] + 1}
            max={max}
          />
        </div>
      </div>

      {/* RC Slider */}
      <div className="mb-6">
        <Slider
          range
          min={min}
          max={max}
          value={localValue}
          onChange={handleSliderChange}
          step={1}
          marks={{
            [min]: formatPrice(min),
            [max]: formatPrice(max),
          }}
          trackStyle={[{ backgroundColor: "#3B82F6", height: 6 }]}
          handleStyle={[
            {
              backgroundColor: "#FFFFFF",
              border: "2px solid #3B82F6",
              height: 20,
              width: 20,
              marginTop: -7,
              cursor: "grab",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            },
            {
              backgroundColor: "#FFFFFF",
              border: "2px solid #3B82F6",
              height: 20,
              width: 20,
              marginTop: -7,
              cursor: "grab",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            },
          ]}
          railStyle={{ backgroundColor: "#E5E7EB", height: 6 }}
        />
      </div>

      {/* Display current values */}
      <div className="flex justify-center text-sm font-medium text-gray-900">
        <span>
          {formatPrice(localValue[0])} — {formatPrice(localValue[1])}
        </span>
      </div>
    </div>
  );
});
