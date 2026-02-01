"use client";

import { memo, useCallback } from "react";
import { SavedItem as SavedItemType } from "@/types/cart";
import { CartItem as CartItemType } from "@/types/cart";
import { getProductById } from "@/data/products";
import { calculateProductPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StockBadge } from "@/components/ui/StockBadge";
import { getAvailableStockForCart } from "@/lib/validation";
import { StaticProductPreview } from "./StaticProductPreview";
import Link from "next/link";

interface SavedItemProps {
  item: SavedItemType;
  cartItems?: CartItemType[];
  onMoveToCart: () => void;
  onRemove: () => void;
}

export const SavedItem = memo(function SavedItem({
  item,
  cartItems = [],
  onMoveToCart,
  onRemove,
}: SavedItemProps) {
  const product = getProductById(item.productId);

  if (!product) {
    return null;
  }

  const price = calculateProductPrice(
    product,
    item.selectedVariants,
    item.quantity,
  );

  // Get available stock accounting for items already in cart
  const availableStock = getAvailableStockForCart(
    product,
    item.selectedVariants,
    cartItems,
  );
  const hasStock = availableStock >= item.quantity;

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

  const handleMoveToCart = useCallback(() => {
    onMoveToCart();
  }, [onMoveToCart]);

  const handleRemove = useCallback(() => {
    onRemove();
  }, [onRemove]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
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
              <span className="font-medium text-gray-700">
                Quantity: {item.quantity}
              </span>
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

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <StockBadge stock={availableStock} />
            {!hasStock && availableStock > 0 && (
              <span className="text-xs text-amber-600">
                Only {availableStock} available
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Action Bar at Bottom */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-300 bg-gray-100 flex gap-2 sm:gap-3 text-xs sm:text-sm flex-shrink-0 whitespace-nowrap">
        <button
          onClick={handleMoveToCart}
          disabled={!hasStock}
          className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed active:text-blue-800"
        >
          {hasStock ? "Move to Cart" : "Out of Stock"}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-700 font-medium active:text-red-800"
        >
          Remove
        </button>
      </div>
    </div>
  );
});
