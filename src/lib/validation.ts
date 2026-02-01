import { Product, SelectedVariants } from "@/types/product";
import { getVariantById } from "@/data/products";

export interface ValidationError {
  field: "color" | "material" | "size";
  message: string;
}

/**
 * Validates if selected variant combination is compatible
 */
export function validateVariantCombination(
  product: Product,
  selectedVariants: SelectedVariants,
): ValidationError[] {
  const errors: ValidationError[] = [];

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

  if (!colorVariant) {
    errors.push({ field: "color", message: "Selected color is not available" });
  }

  if (!materialVariant) {
    errors.push({
      field: "material",
      message: "Selected material is not available",
    });
  }

  if (!sizeVariant) {
    errors.push({ field: "size", message: "Selected size is not available" });
  }

  // Check incompatibility between color and material
  if (colorVariant?.incompatibleWith?.includes(selectedVariants.material)) {
    errors.push({
      field: "material",
      message: `${materialVariant?.name} is not compatible with ${colorVariant.name}`,
    });
  }

  if (materialVariant?.incompatibleWith?.includes(selectedVariants.color)) {
    errors.push({
      field: "color",
      message: `${colorVariant?.name} is not compatible with ${materialVariant.name}`,
    });
  }

  return errors;
}

/**
 * Checks if a specific variant has sufficient stock
 */
export function checkVariantStock(
  product: Product,
  selectedVariants: SelectedVariants,
  quantity: number,
): boolean {
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

  if (!colorVariant || !materialVariant || !sizeVariant) {
    return false;
  }

  // Check if all variants have sufficient stock
  return (
    colorVariant.stock >= quantity &&
    materialVariant.stock >= quantity &&
    sizeVariant.stock >= quantity
  );
}

/**
 * Gets the minimum available stock across all selected variants
 */
export function getAvailableStock(
  product: Product,
  selectedVariants: SelectedVariants,
): number {
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

  if (!colorVariant || !materialVariant || !sizeVariant) {
    return 0;
  }

  return Math.min(colorVariant.stock, materialVariant.stock, sizeVariant.stock);
}

/**
 * Gets the minimum available stock across all selected variants,
 * accounting for items already in the cart across ALL combinations
 */
export function getAvailableStockForCart(
  product: Product,
  selectedVariants: SelectedVariants,
  cartItems: any[] = [],
): number {
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

  if (!colorVariant || !materialVariant || !sizeVariant) {
    return 0;
  }

  // Calculate remaining stock for each variant independently
  const colorUsed = cartItems.reduce((sum, item) => {
    if (
      item.productId === product.id &&
      item.selectedVariants.color === selectedVariants.color
    ) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  const materialUsed = cartItems.reduce((sum, item) => {
    if (
      item.productId === product.id &&
      item.selectedVariants.material === selectedVariants.material
    ) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  const sizeUsed = cartItems.reduce((sum, item) => {
    if (
      item.productId === product.id &&
      item.selectedVariants.size === selectedVariants.size
    ) {
      return sum + item.quantity;
    }
    return sum;
  }, 0);

  // Calculate remaining stock for each variant
  const colorRemaining = Math.max(0, colorVariant.stock - colorUsed);
  const materialRemaining = Math.max(0, materialVariant.stock - materialUsed);
  const sizeRemaining = Math.max(0, sizeVariant.stock - sizeUsed);

  // The available stock for this combination is the minimum of all three
  return Math.min(colorRemaining, materialRemaining, sizeRemaining);
}

/**
 * Checks if a variant is incompatible with currently selected variants
 */
export function isVariantIncompatible(
  product: Product,
  variantType: "colors" | "materials" | "sizes",
  variantId: string,
  selectedVariants: SelectedVariants,
): boolean {
  const variant = getVariantById(product, variantType, variantId);

  if (!variant) return false;

  // Check incompatibility based on variant type
  if (variantType === "colors") {
    return (
      variant.incompatibleWith?.includes(selectedVariants.material) || false
    );
  }

  if (variantType === "materials") {
    return variant.incompatibleWith?.includes(selectedVariants.color) || false;
  }

  return false;
}
