import { PromoCode } from "@/types/promo";

export const promoCodes: PromoCode[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 50,
    validUntil: "2080-12-31T23:59:59.000Z",
    description: "10% off your first order over $50",
  },
  {
    code: "SAVE25",
    discountType: "fixed",
    discountValue: 25,
    minPurchase: 100,
    validUntil: "2080-12-30T23:59:59.000Z",
    description: "$25 off orders over $100",
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    discountValue: 10,
    minPurchase: 75,
    validUntil: "2080-12-31T23:59:59.000Z",
    description: "Free shipping on orders over $75",
  },
];

/**
 * Get promo code by code string
 */
export function getPromoCodeByCode(code: string): PromoCode | undefined {
  return promoCodes.find((p) => p.code.toUpperCase() === code.toUpperCase());
}

export function validatePromoCode(
  code: string,
  subtotal: number,
): PromoCode | null {
  const promo = promoCodes.find(
    (p) => p.code.toUpperCase() === code.toUpperCase(),
  );

  if (!promo) {
    return null;
  }

  // Check if expired
  if (new Date(promo.validUntil) < new Date()) {
    return null;
  }

  // Check minimum purchase
  if (promo.minPurchase && subtotal < promo.minPurchase) {
    return null;
  }

  return promo;
}
