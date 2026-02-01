"use client";

import Link from "next/link";
import { useEffect } from "react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Badge } from "@/components/ui/Badge";
import { StaticProductPreview } from "@/components/cart/StaticProductPreview";

export default function Home() {
  const { items, loadCartFromStorage } = useCartStore();

  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  const cartItemCount = items.length;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tizaraa</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Browse & Filter
              </Link>
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="font-medium">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">3D Product Customization</h1>
          <p className="text-xl text-blue-100 mb-8">
            Design your perfect product with real-time 3D preview
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <Badge
              variant="default"
              className="bg-white/20 text-white px-4 py-2"
            >
              ✨ Real-time 3D Preview
            </Badge>
            <Badge
              variant="default"
              className="bg-white/20 text-white px-4 py-2"
            >
              🎨 Unlimited Customization
            </Badge>
            <Badge
              variant="default"
              className="bg-white/20 text-white px-4 py-2"
            >
              💰 Dynamic Pricing
            </Badge>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Browse & Filter Products
          </Link>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Our Products</h2>
          <Link
            href="/products"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            View All
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
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
                    <span className="font-medium text-sm">
                      {product.rating}
                    </span>
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
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 mt-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">
                Unlimited Customization
              </h3>
              <p className="text-gray-600">
                Choose from multiple colors, materials, and sizes to create your
                perfect product
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">👁️</div>
              <h3 className="text-xl font-bold mb-2">Real-time 3D Preview</h3>
              <p className="text-gray-600">
                See your changes instantly in an interactive 3D view with
                rotation and zoom
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💎</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All products are crafted with premium materials and attention to
                detail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
