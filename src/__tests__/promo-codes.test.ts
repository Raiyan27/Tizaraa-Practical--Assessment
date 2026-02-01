import { validatePromoCode, getPromoCodeByCode } from "../data/promo-codes";

describe("Promo Code Validation", () => {
  describe("validatePromoCode", () => {
    it("should validate a valid promo code with sufficient purchase amount", () => {
      const result = validatePromoCode("WELCOME10", 60);
      expect(result).toBeTruthy();
      expect(result?.code).toBe("WELCOME10");
      expect(result?.discountType).toBe("percentage");
      expect(result?.discountValue).toBe(10);
    });

    it("should return null for invalid promo code", () => {
      const result = validatePromoCode("INVALID", 100);
      expect(result).toBeNull();
    });

    it("should return null when purchase amount is below minimum", () => {
      const result = validatePromoCode("WELCOME10", 40); // Min purchase is 50
      expect(result).toBeNull();
    });

    it("should validate fixed discount promo codes", () => {
      const result = validatePromoCode("SAVE25", 120);
      expect(result).toBeTruthy();
      expect(result?.code).toBe("SAVE25");
      expect(result?.discountType).toBe("fixed");
      expect(result?.discountValue).toBe(25);
    });

    it("should validate FREESHIP promo code", () => {
      const result = validatePromoCode("FREESHIP", 80);
      expect(result).toBeTruthy();
      expect(result?.code).toBe("FREESHIP");
      expect(result?.discountType).toBe("fixed");
      expect(result?.discountValue).toBe(10);
    });

    it("should handle case insensitive promo codes", () => {
      const result = validatePromoCode("welcome10", 60);
      expect(result).toBeTruthy();
      expect(result?.code).toBe("WELCOME10");
    });
  });

  describe("getPromoCodeByCode", () => {
    it("should return promo code object for valid code", () => {
      const result = getPromoCodeByCode("WELCOME10");
      expect(result).toBeTruthy();
      expect(result?.code).toBe("WELCOME10");
    });

    it("should return undefined for invalid code", () => {
      const result = getPromoCodeByCode("INVALID");
      expect(result).toBeUndefined();
    });

    it("should handle case insensitive lookup", () => {
      const result = getPromoCodeByCode("welcome10");
      expect(result).toBeTruthy();
      expect(result?.code).toBe("WELCOME10");
    });
  });
});
