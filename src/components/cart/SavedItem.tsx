"use client";

import { SavedItem as SavedItemType } from "@/types/cart";
import { getProductById } from "@/data/products";
import { calculateProductPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StockBadge } from "@/components/ui/StockBadge";
import { getAvailableStock, checkVariantStock } from "@/lib/validation";
import Link from "next/link";

interface SavedItemProps {
  item: SavedItemType;
  onMoveToCart: () => void;
  onRemove: () => void;
}

export function SavedItem({ item, onMoveToCart, onRemove }: SavedItemProps) {
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
  const hasStock = checkVariantStock(
    product,
    item.selectedVariants,
    item.quantity,
  );

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
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex gap-4">
        {/* Product Image Placeholder */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
          <div
            className="w-12 h-12 rounded"
            style={{ backgroundColor: colorVariant?.hex }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <Link
                href={`/product/${item.productId}`}
                className="font-semibold text-gray-900 hover:text-blue-600"
              >
                {product.name}
              </Link>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                <span>Color: {colorVariant?.name}</span>
                <span>•</span>
                <span>Material: {materialVariant?.name}</span>
                <span>•</span>
                <span>Size: {sizeVariant?.name}</span>
              </div>
            </div>
            <PriceDisplay amount={price} className="font-bold" />
          </div>

          {/* Stock Status */}
          <div className="mb-2">
            <StockBadge stock={availableStock} />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onMoveToCart}
              disabled={!hasStock}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {hasStock ? "Move to Cart" : "Out of Stock"}
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
  );
}
