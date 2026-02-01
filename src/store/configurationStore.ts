import { create } from "zustand";
import { Product, SelectedVariants } from "@/types/product";

interface ConfigurationState {
  selectedVariants: SelectedVariants;
  quantity: number;
  setColor: (colorId: string) => void;
  setMaterial: (materialId: string) => void;
  setSize: (sizeId: string) => void;
  setQuantity: (quantity: number) => void;
  initializeFromProduct: (product: Product) => void;
  reset: () => void;
}

const getDefaultVariants = (product?: Product): SelectedVariants => {
  if (!product) {
    return { color: "", material: "", size: "" };
  }

  return {
    color: product.variants.colors[0]?.id || "",
    material: product.variants.materials[0]?.id || "",
    size: product.variants.sizes[0]?.id || "",
  };
};

export const useConfigurationStore = create<ConfigurationState>((set) => ({
  selectedVariants: { color: "", material: "", size: "" },
  quantity: 1,

  setColor: (colorId: string) =>
    set((state) => ({
      selectedVariants: { ...state.selectedVariants, color: colorId },
      quantity: 1,
    })),

  setMaterial: (materialId: string) =>
    set((state) => ({
      selectedVariants: { ...state.selectedVariants, material: materialId },
      quantity: 1,
    })),

  setSize: (sizeId: string) =>
    set((state) => ({
      selectedVariants: { ...state.selectedVariants, size: sizeId },
      quantity: 1,
    })),

  setQuantity: (quantity: number) =>
    set({ quantity: Math.max(1, Math.min(99, quantity)) }),

  initializeFromProduct: (product: Product) =>
    set({
      selectedVariants: getDefaultVariants(product),
      quantity: 1,
    }),

  reset: () =>
    set({
      selectedVariants: { color: "", material: "", size: "" },
      quantity: 1,
    }),
}));
