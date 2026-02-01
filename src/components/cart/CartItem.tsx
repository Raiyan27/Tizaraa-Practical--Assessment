"use client";

import { CartItem as CartItemType } from "@/types/cart";
import { getProductById } from "@/data/products";
import { calculateProductPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { StockBadge } from "@/components/ui/StockBadge";
import { getAvailableStock } from "@/lib/validation";
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
    item.quantity
  );

  const availableStock = getAvailableStock(product, item.selectedVariants);
  const isLowStock = availableStock < 5 && availableStock > 0;

  // Get variant details
  const colorVariant = product.variants.colors.find(
    (c) => c.id === item.selectedVariants.color
  );
  const materialVariant = product.variants.materials.find(
    (m) => m.id === item.selectedVariants.material
  );
  const sizeVariant = product.variants.sizes.find(
    (s) => s.id === item.selectedVariants.size
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex gap-4">
        {/* Product Image Placeholder */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <div
            className="w-16 h-16 rounded"
            style={{ backgroundColor: colorVariant?.hex }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link
                href={`/product/${item.productId}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600"
              >
                {product.name}
              </Link>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                <span>Color: {colorVariant?.name}</span>
                <span>•</span>
                <span>Material: {materialVariant?.name}</span>
                <span>•</span>
                <span>Size: {sizeVariant?.label}</span>
              </div>
            </div>
            <div className="text-right">
              <PriceDisplay
                amount={price.total}
                className="text-lg font-bold"
              />
              {item.quantity > 1 && (
                <div className="text-sm text-gray-500">
                  <PriceDisplay amount={price.total / item.quantity} /> each
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
          <div className="flex items-center justify-between gap-4">
            <QuantitySelector
              value={item.quantity}
              onChange={onUpdateQuantity}
              min={1}
              max={availableStock}
            />

            <div className="flex gap-2">
              <button
                onClick={onSaveForLater}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Save for Later
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={onRemove}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
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
