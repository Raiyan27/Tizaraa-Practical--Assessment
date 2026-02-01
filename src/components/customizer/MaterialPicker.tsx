"use client";

import { Variant, Product, SelectedVariants } from "@/types/product";
import { Badge } from "../ui/Badge";
import { CartItem } from "@/types/cart";

interface MaterialPickerProps {
  materials: Variant[];
  selectedMaterialId: string;
  onSelectMaterial: (materialId: string) => void;
  disabledMaterials?: string[];
  product?: Product;
  selectedVariants?: SelectedVariants;
  cartItems?: CartItem[];
}

export function MaterialPicker({
  materials,
  selectedMaterialId,
  onSelectMaterial,
  disabledMaterials = [],
  product,
  selectedVariants,
  cartItems = [],
}: MaterialPickerProps) {
  const getActualStock = (materialId: string): number => {
    const material = materials.find((m) => m.id === materialId);
    if (!material || !product) return material?.stock || 0;

    // Calculate how much of this material is already in cart across ALL combinations
    const usedStock = cartItems.reduce((sum, item) => {
      if (
        item.productId === product.id &&
        item.selectedVariants.material === materialId
      ) {
        return sum + item.quantity;
      }
      return sum;
    }, 0);

    return Math.max(0, material.stock - usedStock);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-900">Material</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {materials.map((material) => {
          const actualStock = getActualStock(material.id);
          const isSelected = material.id === selectedMaterialId;
          const isDisabled =
            disabledMaterials.includes(material.id) || actualStock === 0;
          const isLowStock = actualStock > 0 && actualStock <= 5;

          return (
            <button
              key={material.id}
              onClick={() => !isDisabled && onSelectMaterial(material.id)}
              disabled={isDisabled}
              className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">
                    {material.name}
                  </p>
                  {material.priceModifier !== 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {material.priceModifier > 0 ? "+" : ""}$
                      {material.priceModifier}
                    </p>
                  )}
                </div>
                {isSelected && (
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {isLowStock && !isDisabled && (
                <Badge variant="warning" className="text-xs mt-2">
                  Only {actualStock} left
                </Badge>
              )}
              {actualStock === 0 && (
                <Badge variant="error" className="text-xs mt-2">
                  Out of stock
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
