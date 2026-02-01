"use client";

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
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
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

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-200">
      <div className="flex gap-3 sm:gap-4">
        {/* Static 3D Preview */}
        <div className="shrink-0">
          <StaticProductPreview
            product={product}
            selectedVariants={item.selectedVariants}
            size={80}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
            <div className="min-w-0">
              <Link
                href={`/product/${item.productId}`}
                className="text-base sm:text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
              >
                {product.name}
              </Link>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                <span>Color: {colorVariant?.name}</span>
                <span className="hidden sm:inline">•</span>
                <span>Material: {materialVariant?.name}</span>
                <span className="hidden sm:inline">•</span>
                <span>Size: {sizeVariant?.name}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <PriceDisplay
                amount={price}
                className="text-base sm:text-lg font-bold"
              />
              {item.quantity > 1 && (
                <div className="text-xs sm:text-sm text-gray-500">
                  <PriceDisplay amount={price / item.quantity} /> each
                </div>
              )}
            </div>
          </div>

          {/* Stock Warning */}
          {isLowStock && (
            <div className="mb-2">
              <StockBadge stock={availableStock} />
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-3">
            <QuantitySelector
              value={item.quantity}
              onChange={onUpdateQuantity}
              min={1}
              max={availableStock}
            />

            <div className="flex gap-2 text-xs sm:text-sm">
              <button
                onClick={onSaveForLater}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Save
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
