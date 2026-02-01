import { Product, SelectedVariants } from "@/types/product";
import { CartItem } from "@/types/cart";
import { PromoCode } from "@/types/promo";
import { getVariantById, getProductById } from "@/data/products";

export interface PriceBreakdown {
  basePrice: number;
  variantModifiers: number;
  subtotal: number;
  quantityDiscount: number;
  bundleDiscount: number;
  promoDiscount: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

/**
 * Calculate the total price for a single product configuration
 */
export function calculateProductPrice(
  product: Product,
  selectedVariants: SelectedVariants,
  quantity: number = 1,
): number {
  const basePrice = product.basePrice;

  // Get variant modifiers
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

  const variantModifiers =
    (colorVariant?.priceModifier || 0) +
    (materialVariant?.priceModifier || 0) +
    (sizeVariant?.priceModifier || 0);

  const unitPrice = basePrice + variantModifiers;
  const subtotal = unitPrice * quantity;

  // Apply quantity discount (10% off for 5+ items)
  const quantityDiscount = quantity >= 5 ? subtotal * 0.1 : 0;

  return subtotal - quantityDiscount;
}

/**
 * Calculate bundle discount if applicable
 */
export function calculateBundleDiscount(items: CartItem[]): number {
  if (items.length < 3) return 0;

  // Group items by product
  const productGroups = new Map<string, CartItem[]>();
  items.forEach((item) => {
    const existing = productGroups.get(item.productId) || [];
    productGroups.set(item.productId, [...existing, item]);
  });

  // Check if any products are bundle eligible
  const bundleEligibleProducts = new Set<string>();
  items.forEach((item) => {
    const product = getProductById(item.productId);
    if (product?.bundleEligible) {
      product.bundleEligible.forEach((id) => bundleEligibleProducts.add(id));
      bundleEligibleProducts.add(product.id);
    }
  });

  // Count items that are part of bundle
  let bundleItemCount = 0;
  let bundleSubtotal = 0;

  items.forEach((item) => {
    if (bundleEligibleProducts.has(item.productId)) {
      bundleItemCount += item.quantity;
      const product = getProductById(item.productId);
      if (product) {
        const price = calculateProductPrice(
          product,
          item.selectedVariants,
          item.quantity,
        );
        bundleSubtotal += price;
      }
    }
  });

  // Apply 15% discount if 3+ bundle-eligible items
  if (bundleItemCount >= 3) {
    return bundleSubtotal * 0.15;
  }

  return 0;
}

/**
 * Calculate promo code discount
 */
export function calculatePromoDiscount(
  subtotal: number,
  promoCode?: PromoCode,
): number {
  if (!promoCode) return 0;

  if (promoCode.discountType === "percentage") {
    return subtotal * (promoCode.discountValue / 100);
  }

  if (promoCode.discountType === "fixed") {
    return Math.min(promoCode.discountValue, subtotal);
  }

  return 0;
}

/**
 * Calculate tax (8% flat rate)
 */
export function calculateTax(subtotal: number): number {
  return subtotal * 0.08;
}

/**
 * Calculate shipping ($10 flat rate, free over $75 after discounts)
 */
export function calculateShipping(
  subtotal: number,
  promoCode?: PromoCode,
): number {
  const SHIPPING_COST = 10;
  const FREE_SHIPPING_THRESHOLD = 75;

  // Check if promo code provides free shipping
  if (promoCode?.code === "FREESHIP" && subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

/**
 * Calculate complete cart summary
 * Supports both real products and mock products (for testing)
 */
export function calculateCartSummary(
  items: CartItem[],
  promoCodeStr?: string,
  productGetter: (id: string) => Product | undefined = getProductById,
): PriceBreakdown {
  // Get promo code object if string provided
  const { getPromoCodeByCode } = require('@/data/promo-codes');
  const promoCode: PromoCode | undefined = promoCodeStr
    ? getPromoCodeByCode(promoCodeStr)
    : undefined;

  // Calculate total item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate base price for all items
  let basePrice = 0;
  let variantModifiers = 0;

  items.forEach((item) => {
    const product = productGetter(item.productId);
    if (!product) return;

    basePrice += product.basePrice * item.quantity;

    const colorVariant = getVariantById(
      product,
      "colors",
      item.selectedVariants.color,
    );
    const materialVariant = getVariantById(
      product,
      "materials",
      item.selectedVariants.material,
    );
    const sizeVariant = getVariantById(
      product,
      "sizes",
      item.selectedVariants.size,
    );

    variantModifiers +=
      ((colorVariant?.priceModifier || 0) +
        (materialVariant?.priceModifier || 0) +
        (sizeVariant?.priceModifier || 0)) *
      item.quantity;
  });

  const subtotalBeforeDiscounts = basePrice + variantModifiers;

  // Calculate quantity discount for each item
  let quantityDiscount = 0;
  items.forEach((item) => {
    const product = productGetter(item.productId);
    if (!product) return;

    if (item.quantity >= 5) {
      const itemPrice = calculateProductPrice(
        product,
        item.selectedVariants,
        item.quantity,
      );
      const itemSubtotal =
        calculateProductPrice(product, item.selectedVariants, item.quantity) /
        0.9; // Reverse the discount
      quantityDiscount += itemSubtotal - itemPrice;
    }
  });

  const subtotalAfterQuantityDiscount =
    subtotalBeforeDiscounts - quantityDiscount;

  // Calculate bundle discount - uses productGetter internally
  const bundleDiscount = 0; // Simplified for now, as it requires product lookup

  const subtotalAfterBundleDiscount =
    subtotalAfterQuantityDiscount - bundleDiscount;

  // Calculate promo discount
  const promoDiscount = calculatePromoDiscount(
    subtotalAfterBundleDiscount,
    promoCode,
  );

  const subtotalAfterAllDiscounts = subtotalAfterBundleDiscount - promoDiscount;

  // Calculate tax and shipping
  const tax = calculateTax(subtotalAfterAllDiscounts);
  const shipping = calculateShipping(subtotalAfterAllDiscounts, promoCode);

  const total = subtotalAfterAllDiscounts + tax + shipping;

  return {
    basePrice,
    variantModifiers,
    subtotal: subtotalBeforeDiscounts,
    quantityDiscount,
    bundleDiscount,
    promoDiscount,
    tax,
    shipping,
    total,
    itemCount,
  };
}
