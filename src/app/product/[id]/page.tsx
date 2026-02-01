"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/data/products";
import { useConfigurationStore } from "@/store/configurationStore";
import { ProductViewer } from "@/components/3d/ProductViewer";
import { ColorPicker } from "@/components/customizer/ColorPicker";
import { MaterialPicker } from "@/components/customizer/MaterialPicker";
import { SizePicker } from "@/components/customizer/SizePicker";
import { PriceSummary } from "@/components/customizer/PriceSummary";
import { ConfiguratorSkeleton } from "@/components/ui/Skeleton";
import { isVariantIncompatible } from "@/lib/validation";
import { Badge } from "@/components/ui/Badge";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    selectedVariants,
    quantity,
    setColor,
    setMaterial,
    setSize,
    setQuantity,
    initializeFromProduct,
  } = useConfigurationStore();

  const product = getProductById(productId);

  useEffect(() => {
    if (product) {
      initializeFromProduct(product);
    }
  }, [product, initializeFromProduct]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Get disabled variants based on incompatibilities
  const disabledColors = product.variants.colors
    .filter((c) =>
      isVariantIncompatible(product, "colors", c.id, selectedVariants),
    )
    .map((c) => c.id);

  const disabledMaterials = product.variants.materials
    .filter((m) =>
      isVariantIncompatible(product, "materials", m.id, selectedVariants),
    )
    .map((m) => m.id);

  const handleAddToCart = () => {
    alert("Cart functionality coming soon! Configuration saved.");
    console.log("Add to cart:", { productId, selectedVariants, quantity });
  };

  if (!selectedVariants.color) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ConfiguratorSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.push("/")}
          className="text-blue-600 hover:text-blue-700 font-medium mb-6 inline-flex items-center gap-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* 3D Viewer */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <ProductViewer
              product={product}
              selectedVariants={selectedVariants}
            />
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Product Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-gray-500">
                        ({product.reviewCount} reviews)
                      </span>
                    </div>
                    {product.brand && (
                      <Badge variant="info">{product.brand}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Customization Options */}
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Customize Your Product
              </h2>

              <ColorPicker
                colors={product.variants.colors}
                selectedColorId={selectedVariants.color}
                onSelectColor={setColor}
                disabledColors={disabledColors}
              />

              <MaterialPicker
                materials={product.variants.materials}
                selectedMaterialId={selectedVariants.material}
                onSelectMaterial={setMaterial}
                disabledMaterials={disabledMaterials}
              />

              <SizePicker
                sizes={product.variants.sizes}
                selectedSizeId={selectedVariants.size}
                onSelectSize={setSize}
              />
            </div>

            {/* Price Summary */}
            <PriceSummary
              product={product}
              selectedVariants={selectedVariants}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Product Details
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="font-medium text-gray-900">Category:</span>{" "}
              <span className="text-gray-600">{product.category}</span>
            </div>
            {product.brand && (
              <div>
                <span className="font-medium text-gray-900">Brand:</span>{" "}
                <span className="text-gray-600">{product.brand}</span>
              </div>
            )}
            {product.origin && (
              <div>
                <span className="font-medium text-gray-900">Origin:</span>{" "}
                <span className="text-gray-600">{product.origin}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
