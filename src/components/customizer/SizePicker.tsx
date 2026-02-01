"use client";

import { Variant, Product, SelectedVariants } from "@/types/product";
import { Badge } from "../ui/Badge";
import { CartItem } from "@/types/cart";

interface SizePickerProps {
  sizes: Variant[];
  selectedSizeId: string;
  onSelectSize: (sizeId: string) => void;
  product?: Product;
  selectedVariants?: SelectedVariants;
  cartItems?: CartItem[];
}

export function SizePicker({
  sizes,
  selectedSizeId,
  onSelectSize,
  product,
  selectedVariants,
  cartItems = [],
}: SizePickerProps) {
  const getActualStock = (sizeId: string): number => {
    const size = sizes.find((s) => s.id === sizeId);
    if (!size || !product) return size?.stock || 0;

    // Calculate how much of this size is already in cart across ALL combinations
    const usedStock = cartItems.reduce((sum, item) => {
      if (
        item.productId === product.id &&
        item.selectedVariants.size === sizeId
      ) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);

    return Math.max(0, size.stock - usedStock);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Size</h3>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const actualStock = getActualStock(size.id);
          const isSelected = size.id === selectedSizeId;
          const isOutOfStock = actualStock === 0;
          const isLowStock = actualStock > 0 && actualStock <= 5;

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
                    {actualStock} left
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
