"use client";

import { Variant } from "@/types/product";
import { Badge } from "../ui/Badge";

interface ColorPickerProps {
  colors: Variant[];
  selectedColorId: string;
  onSelectColor: (colorId: string) => void;
  disabledColors?: string[];
}

export function ColorPicker({
  colors,
  selectedColorId,
  onSelectColor,
  disabledColors = [],
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Color</h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = color.id === selectedColorId;
          const isDisabled =
            disabledColors.includes(color.id) || color.stock === 0;
          const isLowStock = color.stock > 0 && color.stock <= 5;

          return (
            <button
              key={color.id}
              onClick={() => !isDisabled && onSelectColor(color.id)}
              disabled={isDisabled}
              className={`relative group flex flex-col items-center gap-2 ${
                isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
              title={`${color.name} ${color.priceModifier > 0 ? `(+$${color.priceModifier})` : ""}`}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-300 ring-offset-2"
                    : "border-gray-300 hover:border-gray-400"
                } ${isDisabled ? "cursor-not-allowed" : ""}`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white drop-shadow-lg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-gray-700">
                  {color.name}
                </p>
                {color.priceModifier !== 0 && (
                  <p className="text-xs text-gray-500">
                    {color.priceModifier > 0 ? "+" : ""}${color.priceModifier}
                  </p>
                )}
                {isLowStock && !isDisabled && (
                  <Badge variant="warning" className="text-xs mt-1">
                    {color.stock} left
                  </Badge>
                )}
                {color.stock === 0 && (
                  <Badge variant="error" className="text-xs mt-1">
                    Out of stock
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
