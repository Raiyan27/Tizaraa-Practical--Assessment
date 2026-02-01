"use client";

import Link from "next/link";
import { useEffect } from "react";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { Badge } from "@/components/ui/Badge";
import { HomeProductCard } from "@/components/products/HomeProductCard";

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
        <nav className="container mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Tizaraa</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                aria-label="Browse and filter products"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                className="relative inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Shopping cart with ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'}`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center" aria-label={`${cartItemCount} items in cart`}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white" aria-labelledby="hero-heading">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 id="hero-heading" className="text-5xl font-bold mb-4">3D Product Customization</h1>
          <p className="text-xl text-blue-100 mb-8">
            Design your perfect product with real-time 3D preview
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-8" role="list" aria-label="Features">
            <div role="listitem">
              <Badge
                variant="default"
                className="bg-white/20 text-white px-4 py-2"
              >
                ✨ Real-time 3D Preview
              </Badge>
            </div>
            <div role="listitem">
              <Badge
                variant="default"
                className="bg-white/20 text-white px-4 py-2"
              >
                🎨 Unlimited Customization
              </Badge>
            </div>
            <div role="listitem">
              <Badge
                variant="default"
                className="bg-white/20 text-white px-4 py-2"
              >
                💰 Dynamic Pricing
              </Badge>
            </div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      </section>

      {/* Products Grid */}
      <main id="main-content" className="container mx-auto px-4 py-12">
        <section aria-labelledby="products-heading">
          <div className="flex items-center justify-between mb-8">
            <h2 id="products-heading" className="text-3xl font-bold text-gray-900">Our Products</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            >
              View All
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Product grid">
            {products.map((product) => (
              <div key={product.id} role="listitem">
                <HomeProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 mt-12" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <h2 id="features-heading" className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8" role="list" aria-label="Features">
            <article className="text-center" role="listitem">
              <div className="text-5xl mb-4" aria-hidden="true">🎨</div>
              <h3 className="text-xl font-bold mb-2">
                Unlimited Customization
              </h3>
              <p className="text-gray-600">
                Choose from multiple colors, materials, and sizes to create your
                perfect product
              </p>
            </article>
            <article className="text-center" role="listitem">
              <div className="text-5xl mb-4" aria-hidden="true">👁️</div>
              <h3 className="text-xl font-bold mb-2">Real-time 3D Preview</h3>
              <p className="text-gray-600">
                See your changes instantly in an interactive 3D view with
                rotation and zoom
              </p>
            </article>
            <article className="text-center" role="listitem">
              <div className="text-5xl mb-4" aria-hidden="true">💎</div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                All products are crafted with premium materials and attention to
                detail
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
