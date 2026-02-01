export interface Variant {
  id: string;
  name: string;
  priceModifier: number;
  stock: number;
  hex?: string; // For color variants
  incompatibleWith?: string[]; // IDs of incompatible variants
}

export interface ProductVariants {
  colors: Variant[];
  materials: Variant[];
  sizes: Variant[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  rating: number;
  reviewCount: number;
  variants: ProductVariants;
  bundleEligible?: string[]; // IDs of products eligible for bundle discount
  category?: string;
  brand?: string;
  origin?: string;
  createdAt?: string;
  geometryType?: 'box' | 'cylinder' | 'sphere' | 'torus' | 'lathe' | 'combined';
}

export interface SelectedVariants {
  color: string;
  material: string;
  size: string;
}

export interface ProductConfiguration {
  productId: string;
  selectedVariants: SelectedVariants;
  quantity: number;
  customizations?: Record<string, unknown>;
}
