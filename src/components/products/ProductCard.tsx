"use client";

import { memo } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { StaticProductPreview } from "@/components/cart/StaticProductPreview";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
    >
      {/* Product Preview */}
      <div className="h-48 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all" />
        <StaticProductPreview
          product={product}
          selectedVariants={{
            color: product.variants.colors[0].id,
            material: product.variants.materials[0].id,
            size: product.variants.sizes[0].id,
          }}
          size={120}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium text-sm">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-xs">
            ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price & Variants */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs">Starting at</p>
            <PriceDisplay
              amount={product.basePrice}
              className="text-xl text-blue-600 font-bold"
            />
          </div>
          <div className="flex gap-1">
            {product.variants.colors.slice(0, 4).map((color) => (
              <div
                key={color.id}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
            {product.variants.colors.length > 4 && (
              <span className="text-xs text-gray-400 ml-1">
                +{product.variants.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          {product.brand && <span>{product.brand}</span>}
          {product.category && (
            <Badge variant="default" className="text-xs">
              {product.category}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
});
