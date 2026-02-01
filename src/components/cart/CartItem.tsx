"use client";

import { memo, useCallback } from "react";
import { CartItem as CartItemType } from "@/types/cart";
import { getProductById } from "@/data/products";
import { calculateProductPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { StockBadge } from "@/components/ui/StockBadge";
import { getAvailableStock } from "@/lib/validation";
import { StaticProductPreview } from "./StaticProductPreview";
import Link from "next/link";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onSaveForLater: () => void;
  isLoading?: boolean;
}

export const CartItem = memo(function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  isLoading = false,
}: CartItemProps) {
  const product = getProductById(item.productId);

  if (!product) {
    return null;
  }

  const price = calculateProductPrice(
    product,
    item.selectedVariants,
    item.quantity,
  );

  const availableStock = getAvailableStock(product, item.selectedVariants);
  const isLowStock = availableStock < 5 && availableStock > 0;

  // Get variant details
  const colorVariant = product.variants.colors.find(
    (c) => c.id === item.selectedVariants.color,
  );
  const materialVariant = product.variants.materials.find(
    (m) => m.id === item.selectedVariants.material,
  );
  const sizeVariant = product.variants.sizes.find(
    (s) => s.id === item.selectedVariants.size,
  );

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      onUpdateQuantity(quantity);
    },
    [onUpdateQuantity],
  );

  const handleRemove = useCallback(() => {
    onRemove();
  }, [onRemove]);

  const handleSaveForLater = useCallback(() => {
    onSaveForLater();
  }, [onSaveForLater]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
      <div className="p-3 sm:p-4 flex gap-3 sm:gap-4 flex-1">
        {/* Static 3D Preview */}
        <div className="shrink-0">
          <StaticProductPreview
            product={product}
            selectedVariants={item.selectedVariants}
            size={80}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Name and Specs */}
          <div className="mb-2">
            <Link
              href={`/product/${item.productId}`}
              className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {product.name}
            </Link>
            <div className="flex flex-col gap-1 mt-1 text-xs text-gray-600">
              <span>Color: {colorVariant?.name}</span>
              <span>Material: {materialVariant?.name}</span>
              <span>Size: {sizeVariant?.name}</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            <div className="font-bold text-sm sm:text-base text-gray-900">
              <PriceDisplay amount={price} />
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-gray-500">
                <PriceDisplay amount={price / item.quantity} /> each
              </div>
            )}
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <div>
              <StockBadge stock={availableStock} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed Action Bar at Bottom */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0">
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <QuantitySelector
            value={item.quantity}
            onChange={handleQuantityChange}
            min={1}
            max={availableStock}
            isLoading={isLoading}
          />
        </div>

        <div className="flex gap-2 sm:gap-3 text-xs sm:text-sm shrink-0 whitespace-nowrap">
          <button
            onClick={handleSaveForLater}
            disabled={isLoading}
            className={`font-medium active:text-blue-800 ${
              isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {isLoading ? "Saving..." : "Save for later"}
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className={`font-medium active:text-red-800 ${
              isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-red-600 hover:text-red-700"
            }`}
          >
            {isLoading ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
});
