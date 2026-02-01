import { z } from "zod";

// Base schemas for common types
export const variantSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  name: z.string().min(1, "Variant name is required"),
  priceModifier: z.number().min(0, "Price modifier must be non-negative"),
  stock: z.number().int().min(0, "Stock must be non-negative"),
  hex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").optional(),
  incompatibleWith: z.array(z.string()).optional(),
});

export const productVariantsSchema = z.object({
  colors: z.array(variantSchema),
  materials: z.array(variantSchema),
  sizes: z.array(variantSchema),
});

export const productSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  basePrice: z.number().positive("Base price must be positive"),
  images: z.array(z.string().url("Invalid image URL")),
  rating: z.number().min(0).max(5, "Rating must be between 0 and 5"),
  reviewCount: z.number().int().min(0, "Review count must be non-negative"),
  variants: productVariantsSchema,
  bundleEligible: z.array(z.string()).optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  origin: z.string().optional(),
  createdAt: z.string().optional(),
  geometryType: z.enum(["box", "cylinder", "sphere", "torus", "lathe", "combined"]).optional(),
});

export const selectedVariantsSchema = z.object({
  color: z.string().min(1, "Color selection is required"),
  material: z.string().min(1, "Material selection is required"),
  size: z.string().min(1, "Size selection is required"),
});

export const productConfigurationSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  selectedVariants: selectedVariantsSchema,
  quantity: z.number().int().positive("Quantity must be positive"),
  customizations: z.record(z.string(), z.unknown()).optional(),
});

// Cart schemas
export const cartItemSchema = z.object({
  id: z.string().min(1, "Cart item ID is required"),
  productId: z.string().min(1, "Product ID is required"),
  selectedVariants: selectedVariantsSchema,
  quantity: z.number().int().positive("Quantity must be positive"),
  customizations: z.record(z.string(), z.unknown()).optional(),
  addedAt: z.string().datetime("Invalid timestamp"),
});

export const savedItemSchema = cartItemSchema.extend({
  savedAt: z.string().datetime("Invalid timestamp"),
}).omit({ id: true }).extend({
  id: z.string().min(1, "Saved item ID is required"),
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  savedItems: z.array(savedItemSchema),
  promoCode: z.string().optional(), // Deprecated
  promoCodes: z.array(z.string()).optional(),
  lastUpdated: z.string().datetime("Invalid timestamp"),
});

// Promo schemas
export const promoCodeSchema = z.object({
  code: z.string().min(1, "Promo code is required").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().positive("Discount value must be positive"),
  minPurchase: z.number().positive("Minimum purchase must be positive").optional(),
  validUntil: z.string().datetime("Invalid date format"),
  description: z.string().optional(),
});

// Form validation schemas
export const promoCodeInputSchema = z.object({
  code: z.string()
    .min(1, "Please enter a promo code")
    .max(20, "Promo code is too long")
    .regex(/^[A-Z0-9_-]+$/i, "Promo code contains invalid characters"),
});

export const quantityInputSchema = z.object({
  quantity: z.number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(99, "Quantity cannot exceed 99"),
});

// Validation result types
export type ValidationError = {
  field: string;
  message: string;
};

export type ValidationResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: ValidationError[];
};

// Utility functions for validation
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fieldPrefix = ""
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError[] = error.issues.map(err => ({
        field: fieldPrefix ? `${fieldPrefix}.${err.path.join('.')}` : err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return {
      success: false,
      errors: [{ field: fieldPrefix || 'unknown', message: 'Validation failed' }]
    };
  }
}

export function validateFormInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; message: string } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.issues[0]?.message || 'Invalid input' };
    }
    return { success: false, message: 'Validation failed' };
  }
}