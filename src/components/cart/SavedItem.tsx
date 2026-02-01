"use client";

import { SavedItem as SavedItemType } from "@/types/cart";
import { getProductById } from "@/data/products";
import { calculateProductPrice } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StockBadge } from "@/components/ui/StockBadge";
import { getAvailableStock, checkVariantStock } from "@/lib/validation";
import { StaticProductPreview } from "./StaticProductPreview";
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
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
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
            <PriceDisplay amount={price} className="font-bold shrink-0" />
          </div>

          {/* Stock Status */}
          <div className="mb-2">
            <StockBadge stock={availableStock} />
          </div>

          {/* Actions */}
          <div className="flex gap-2 text-xs sm:text-sm">
            <button
              onClick={onMoveToCart}
              disabled={!hasStock}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {hasStock ? "Move to Cart" : "Out of Stock"}
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
  );
}
