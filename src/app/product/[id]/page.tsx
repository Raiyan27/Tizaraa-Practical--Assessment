"use client";

import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getProductById } from "@/data/products";
import { useConfigurationStore } from "@/store/configurationStore";
import { useCartStore } from "@/store/cartStore";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
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
  const searchParams = useSearchParams();
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

  const { addProduct } = useRecentlyViewed();
  const { addItem, items: cartItems } = useCartStore();
  const product = getProductById(productId);

  // Initialize from URL or product defaults
  useEffect(() => {
    if (product) {
      const urlColor = searchParams.get("color");
      const urlMaterial = searchParams.get("material");
      const urlSize = searchParams.get("size");

      // Check if URL params are valid variants
      const colorExists =
        urlColor && product.variants.colors.some((c) => c.id === urlColor);
      const materialExists =
        urlMaterial &&
        product.variants.materials.some((m) => m.id === urlMaterial);
      const sizeExists =
        urlSize && product.variants.sizes.some((s) => s.id === urlSize);

      if (colorExists && materialExists && sizeExists) {
        // Initialize from URL
        setColor(urlColor!);
        setMaterial(urlMaterial!);
        setSize(urlSize!);
      } else {
        // Initialize from product defaults
        initializeFromProduct(product);
      }

      addProduct(productId);
    }
  }, [productId, product]);

  // Update URL when variants change
  const handleColorChange = (colorId: string) => {
    setColor(colorId);
    updateUrl(colorId, selectedVariants.material, selectedVariants.size);
  };

  const handleMaterialChange = (materialId: string) => {
    setMaterial(materialId);
    updateUrl(selectedVariants.color, materialId, selectedVariants.size);
  };

  const handleSizeChange = (sizeId: string) => {
    setSize(sizeId);
    updateUrl(selectedVariants.color, selectedVariants.material, sizeId);
  };

  const updateUrl = (color: string, material: string, size: string) => {
    const url = new URLSearchParams();
    url.set("color", color);
    url.set("material", material);
    url.set("size", size);
    router.replace(`?${url.toString()}`, { scroll: false });
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The product you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              ← Back to Home
            </button>
          </div>
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

  const handleAddToCart = async () => {
    try {
      await addItem(productId, selectedVariants, quantity);
      alert(`✓ Added to cart! (${quantity} item${quantity > 1 ? "s" : ""})`);
      setQuantity(1);
    } catch (error) {
      alert(
        `Error: ${error instanceof Error ? error.message : "Could not add to cart"}`,
      );
    }
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
                onSelectColor={handleColorChange}
                disabledColors={disabledColors}
                product={product}
                selectedVariants={selectedVariants}
                cartItems={cartItems}
              />

              <MaterialPicker
                materials={product.variants.materials}
                selectedMaterialId={selectedVariants.material}
                onSelectMaterial={handleMaterialChange}
                disabledMaterials={disabledMaterials}
                product={product}
                selectedVariants={selectedVariants}
                cartItems={cartItems}
              />

              <SizePicker
                sizes={product.variants.sizes}
                selectedSizeId={selectedVariants.size}
                onSelectSize={handleSizeChange}
                product={product}
                selectedVariants={selectedVariants}
                cartItems={cartItems}
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
