import {
  calculateProductPrice,
  calculatePromoDiscount,
  calculateCartSummary,
} from "../lib/pricing";
import { Product, SelectedVariants } from "../types/product";
import { CartItem } from "../types/cart";
import { PromoCode } from "../types/promo";

describe("Pricing Engine", () => {
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
          id: "blue",
          name: "Blue",
          hex: "#0000FF",
          priceModifier: 10,
          stock: 10,
        },
      ],
      materials: [
        { id: "matte", name: "Matte", priceModifier: 0, stock: 10 },
        { id: "glossy", name: "Glossy", priceModifier: 20, stock: 10 },
      ],
      sizes: [
        { id: "s", name: "Small", priceModifier: -10, stock: 10 },
        { id: "m", name: "Medium", priceModifier: 0, stock: 10 },
        { id: "l", name: "Large", priceModifier: 15, stock: 10 },
      ],
    },
  };

  const selectedVariants: SelectedVariants = {
    color: "red",
    material: "matte",
    size: "m",
  };

  describe("calculateProductPrice", () => {
    it("should calculate base price correctly", () => {
      const price = calculateProductPrice(mockProduct, selectedVariants, 1);
      expect(price).toBe(100); // Base price with no modifiers
    });

    it("should apply variant modifiers correctly", () => {
      const variantsWithModifiers: SelectedVariants = {
        color: "blue", // +10
        material: "glossy", // +20
        size: "l", // +15
      };
      const price = calculateProductPrice(
        mockProduct,
        variantsWithModifiers,
        1,
      );
      expect(price).toBe(145); // 100 + 10 + 20 + 15
    });

    it("should apply quantity discount for 5+ items (10% off)", () => {
      const price = calculateProductPrice(mockProduct, selectedVariants, 5);
      const expected = 100 * 5 * 0.9; // 10% discount
      expect(price).toBe(expected);
    });

    it("should not apply quantity discount for less than 5 items", () => {
      const price = calculateProductPrice(mockProduct, selectedVariants, 4);
      expect(price).toBe(400); // No discount
    });
  });

  describe("calculatePromoDiscount", () => {
    it("should calculate percentage discount correctly", () => {
      const promoCode: PromoCode = {
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
        validUntil: "2026-12-31T23:59:59.000Z",
      };
      const discount = calculatePromoDiscount(100, promoCode);
      expect(discount).toBe(10); // 10% of 100
    });

    it("should calculate fixed discount correctly", () => {
      const promoCode: PromoCode = {
        code: "SAVE25",
        discountType: "fixed",
        discountValue: 25,
        validUntil: "2026-12-31T23:59:59.000Z",
      };
      const discount = calculatePromoDiscount(100, promoCode);
      expect(discount).toBe(25);
    });

    it("should not exceed subtotal for fixed discount", () => {
      const promoCode: PromoCode = {
        code: "SAVE25",
        discountType: "fixed",
        discountValue: 150,
        validUntil: "2026-12-31T23:59:59.000Z",
      };
      const discount = calculatePromoDiscount(100, promoCode);
      expect(discount).toBe(100); // Capped at subtotal
    });

    it("should return 0 when no promo code is provided", () => {
      const discount = calculatePromoDiscount(100);
      expect(discount).toBe(0);
    });
  });

  describe("calculateCartSummary", () => {
    // Mock product getter for tests
    const mockProductGetter = (id: string) => {
      if (id === "test-001") return mockProduct;
      return undefined;
    };

    it("should calculate complete cart summary correctly", () => {
      const cartItems: CartItem[] = [
        {
          id: "1",
          productId: "test-001",
          selectedVariants,
          quantity: 2,
          addedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateCartSummary(
        cartItems,
        undefined,
        mockProductGetter,
      );

      expect(summary.basePrice).toBe(200); // 100 * 2
      expect(summary.variantModifiers).toBe(0); // No modifiers
      expect(summary.subtotal).toBe(200);
      expect(summary.tax).toBe(16); // 8% of 200
      expect(summary.shipping).toBe(0); // Free shipping (over $75)
      expect(summary.total).toBe(216); // 200 + 16 + 0
    });

    it("should apply shipping fee for orders under $75", () => {
      // Create a mock product with lower base price
      const lowPriceProduct: Product = {
        ...mockProduct,
        basePrice: 50,
      };

      const mockLowPriceGetter = (id: string) => {
        if (id === "test-001") return lowPriceProduct;
        return undefined;
      };

      const variantsWithModifiers: SelectedVariants = {
        color: "red",
        material: "matte",
        size: "s", // -10, total = 40
      };

      const cartItems: CartItem[] = [
        {
          id: "1",
          productId: "test-001",
          selectedVariants: variantsWithModifiers,
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateCartSummary(
        cartItems,
        undefined,
        mockLowPriceGetter,
      );

      expect(summary.subtotal).toBe(40); // 50 - 10
      expect(summary.shipping).toBe(10); // Flat rate under $75
    });

    it("should apply multiple discounts correctly", () => {
      const cartItems: CartItem[] = [
        {
          id: "1",
          productId: "test-001",
          selectedVariants,
          quantity: 5, // Triggers quantity discount
          addedAt: new Date().toISOString(),
        },
      ];

      const promoCode: PromoCode = {
        code: "TEST10",
        discountType: "percentage",
        discountValue: 10,
        validUntil: "2026-12-31T23:59:59.000Z",
      };

      const summary = calculateCartSummary(
        cartItems,
        promoCode.code,
        mockProductGetter,
      );

      expect(summary.quantityDiscount).toBe(50); // 10% of 500
      expect(summary.promoDiscount).toBeGreaterThan(0);
      expect(summary.total).toBeLessThan(500);
    });
  });
});
