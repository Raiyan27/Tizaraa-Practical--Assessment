"use client";

import { memo } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { StaticProductPreview } from "@/components/cart/StaticProductPreview";

interface HomeProductCardProps {
  product: Product;
}

export const HomeProductCard = memo(function HomeProductCard({
  product,
}: HomeProductCardProps) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      {/* Product 3D Preview */}
      <div className="h-64 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all"></div>
        <StaticProductPreview
          product={product}
          selectedVariants={{
            color: product.variants.colors[0].id,
            material: product.variants.materials[0].id,
            size: product.variants.sizes[0].id,
          }}
          size={150}
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          {product.brand && (
            <Badge variant="info" className="ml-2">
              {product.brand}
            </Badge>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-medium text-sm">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">•</span>
          <span className="text-gray-500 text-sm">
            {product.reviewCount} reviews
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs mb-1">Starting at</p>
            <PriceDisplay
              amount={product.basePrice}
              className="text-2xl text-blue-600"
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="success">
              {product.variants.colors.length} colors
            </Badge>
            <Badge variant="default">
              {product.variants.materials.length} materials
            </Badge>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            {product.category && <span>📦 {product.category}</span>}
            {product.origin && <span>🌍 {product.origin}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
});
