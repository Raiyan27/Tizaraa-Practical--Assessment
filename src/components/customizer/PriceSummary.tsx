"use client";

import { Product, SelectedVariants } from "@/types/product";
import { calculateProductPrice } from "@/lib/pricing";
import { getVariantById } from "@/data/products";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantitySelector } from "../ui/QuantitySelector";
import { Button } from "../ui/Button";

interface PriceSummaryProps {
  product: Product;
  selectedVariants: SelectedVariants;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
}

export function PriceSummary({
  product,
  selectedVariants,
  quantity,
  onQuantityChange,
  onAddToCart,
}: PriceSummaryProps) {
  const colorVariant = getVariantById(
    product,
    "colors",
    selectedVariants.color,
  );
  const materialVariant = getVariantById(
    product,
    "materials",
    selectedVariants.material,
  );
  const sizeVariant = getVariantById(product, "sizes", selectedVariants.size);

  const totalPrice = calculateProductPrice(product, selectedVariants, quantity);
  const hasQuantityDiscount = quantity >= 5;

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Price Summary</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price</span>
          <PriceDisplay amount={product.basePrice} />
        </div>

        {colorVariant && colorVariant.priceModifier !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Color ({colorVariant.name})</span>
            <PriceDisplay
              amount={colorVariant.priceModifier}
              className={
                colorVariant.priceModifier > 0
                  ? "text-green-600"
                  : "text-gray-600"
              }
            />
          </div>
        )}

        {materialVariant && materialVariant.priceModifier !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Material ({materialVariant.name})
            </span>
            <PriceDisplay
              amount={materialVariant.priceModifier}
              className={
                materialVariant.priceModifier > 0
                  ? "text-green-600"
                  : "text-gray-600"
              }
            />
          </div>
        )}

        {sizeVariant && sizeVariant.priceModifier !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Size ({sizeVariant.name})</span>
            <PriceDisplay
              amount={sizeVariant.priceModifier}
              className={
                sizeVariant.priceModifier > 0
                  ? "text-green-600"
                  : "text-gray-600"
              }
            />
          </div>
        )}

        <div className="border-t pt-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-900">Unit Price</span>
            <PriceDisplay
              amount={calculateProductPrice(product, selectedVariants, 1)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <QuantitySelector value={quantity} onChange={onQuantityChange} />
        {hasQuantityDiscount && (
          <p className="text-xs text-green-600 font-medium">
            🎉 10% discount applied for 5+ items!
          </p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <PriceDisplay
            amount={totalPrice}
            className="text-2xl text-blue-600"
          />
        </div>

        <Button onClick={onAddToCart} className="w-full" size="lg">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
