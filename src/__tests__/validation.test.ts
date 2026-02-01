import {
  validateVariantCombination,
  checkVariantStock,
  getAvailableStock,
  isVariantIncompatible,
} from "../lib/validation";
import { Product, SelectedVariants } from "../types/product";

describe("Validation", () => {
  const mockProduct: Product = {
    id: "test-001",
    name: "Test Product",
    description: "Test description",
    basePrice: 100,
    images: [],
    rating: 4.5,
    reviewCount: 10,
    geometryType: "box",
    variants: {
      colors: [
        { id: "red", name: "Red", hex: "#FF0000", priceModifier: 0, stock: 10 },
        {
          id: "neon",
          name: "Neon",
          hex: "#FF00FF",
          priceModifier: 15,
          stock: 5,
          incompatibleWith: ["wood"],
        },
      ],
      materials: [
        { id: "matte", name: "Matte", priceModifier: 0, stock: 20 },
        {
          id: "wood",
          name: "Wood",
          priceModifier: 50,
          stock: 8,
          incompatibleWith: ["neon"],
        },
      ],
      sizes: [
        { id: "s", name: "Small", priceModifier: -10, stock: 15 },
        { id: "m", name: "Medium", priceModifier: 0, stock: 12 },
      ],
    },
  };

  describe("validateVariantCombination", () => {
    it("should return no errors for valid combination", () => {
      const selectedVariants: SelectedVariants = {
        color: "red",
        material: "matte",
        size: "s",
      };

      const errors = validateVariantCombination(mockProduct, selectedVariants);
      expect(errors).toHaveLength(0);
    });

    it("should return error for incompatible color/material combination", () => {
      const selectedVariants: SelectedVariants = {
        color: "neon",
        material: "wood",
        size: "s",
      };

      const errors = validateVariantCombination(mockProduct, selectedVariants);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((e) => e.field === "material" || e.field === "color"),
      ).toBe(true);
    });

    it("should return error for invalid variant selection", () => {
      const selectedVariants: SelectedVariants = {
        color: "invalid",
        material: "matte",
        size: "s",
      };

      const errors = validateVariantCombination(mockProduct, selectedVariants);
      expect(errors.some((e) => e.field === "color")).toBe(true);
    });
  });

  describe("checkVariantStock", () => {
    it("should return true when stock is sufficient", () => {
      const selectedVariants: SelectedVariants = {
        color: "red",
        material: "matte",
        size: "s",
      };

      const hasStock = checkVariantStock(mockProduct, selectedVariants, 5);
      expect(hasStock).toBe(true);
    });

    it("should return false when stock is insufficient", () => {
      const selectedVariants: SelectedVariants = {
        color: "red",
        material: "wood",
        size: "s",
      };

      const hasStock = checkVariantStock(mockProduct, selectedVariants, 15);
      expect(hasStock).toBe(false); // Wood only has 8 stock
    });
  });

  describe("getAvailableStock", () => {
    it("should return minimum stock across all variants", () => {
      const selectedVariants: SelectedVariants = {
        color: "red", // 10 stock
        material: "wood", // 8 stock
        size: "s", // 15 stock
      };

      const stock = getAvailableStock(mockProduct, selectedVariants);
      expect(stock).toBe(8); // Minimum is wood with 8
    });
  });

  describe("isVariantIncompatible", () => {
    it("should detect incompatible material with selected color", () => {
      const selectedVariants: SelectedVariants = {
        color: "neon",
        material: "matte",
        size: "s",
      };

      const incompatible = isVariantIncompatible(
        mockProduct,
        "materials",
        "wood",
        selectedVariants,
      );
      expect(incompatible).toBe(true);
    });

    it("should return false for compatible variants", () => {
      const selectedVariants: SelectedVariants = {
        color: "red",
        material: "matte",
        size: "s",
      };

      const incompatible = isVariantIncompatible(
        mockProduct,
        "materials",
        "wood",
        selectedVariants,
      );
      expect(incompatible).toBe(false);
    });
  });
});
