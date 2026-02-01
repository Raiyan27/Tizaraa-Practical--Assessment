"use client";

import { Variant } from "@/types/product";
import { Badge } from "../ui/Badge";

interface SizePickerProps {
  sizes: Variant[];
  selectedSizeId: string;
  onSelectSize: (sizeId: string) => void;
}

export function SizePicker({
  sizes,
  selectedSizeId,
  onSelectSize,
}: SizePickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Size</h3>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isSelected = size.id === selectedSizeId;
          const isOutOfStock = size.stock === 0;
          const isLowStock = size.stock > 0 && size.stock <= 5;

          return (
            <button
              key={size.id}
              onClick={() => !isOutOfStock && onSelectSize(size.id)}
              disabled={isOutOfStock}
              className={`relative px-6 py-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
              } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex flex-col items-center gap-1">
                <p className="font-medium text-sm">{size.name}</p>
                {size.priceModifier !== 0 && (
                  <p className="text-xs text-gray-500">
                    {size.priceModifier > 0 ? "+" : ""}${size.priceModifier}
                  </p>
                )}
                {isLowStock && !isOutOfStock && (
                  <Badge variant="warning" className="text-xs">
                    {size.stock} left
                  </Badge>
                )}
                {isOutOfStock && (
                  <Badge variant="error" className="text-xs">
                    Out
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
