import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: 'chair-001',
    name: 'Custom Designer Chair',
    description: 'A modern, customizable chair with premium materials and sleek design. Perfect for any contemporary home or office space.',
    basePrice: 299,
    images: ['/products/chair-1.jpg', '/products/chair-2.jpg'],
    rating: 4.7,
    reviewCount: 342,
    category: 'Furniture',
    brand: 'ModernHome',
    origin: 'Italy',
    createdAt: '2026-01-15T10:00:00.000Z',
    geometryType: 'box',
    bundleEligible: ['lamp-002', 'vase-003'],
    variants: {
      colors: [
        { id: 'red', name: 'Cherry Red', hex: '#DC143C', priceModifier: 0, stock: 15 },
        { id: 'blue', name: 'Ocean Blue', hex: '#1E90FF', priceModifier: 0, stock: 23 },
        { id: 'black', name: 'Matte Black', hex: '#1A1A1A', priceModifier: 10, stock: 8 },
        { id: 'white', name: 'Pure White', hex: '#FFFFFF', priceModifier: 0, stock: 42 },
        { id: 'green', name: 'Forest Green', hex: '#228B22', priceModifier: 0, stock: 18 },
        { id: 'neon', name: 'Neon Pink', hex: '#FF10F0', priceModifier: 15, stock: 3, incompatibleWith: ['wood'] },
      ],
      materials: [
        { id: 'matte', name: 'Matte Finish', priceModifier: 0, stock: 100 },
        { id: 'glossy', name: 'Glossy Finish', priceModifier: 20, stock: 85 },
        { id: 'metallic', name: 'Metallic', priceModifier: 40, stock: 45 },
        { id: 'wood', name: 'Wood Grain', priceModifier: 50, stock: 28, incompatibleWith: ['neon'] },
        { id: 'fabric', name: 'Fabric Texture', priceModifier: 30, stock: 60 },
      ],
      sizes: [
        { id: 's', name: 'Small', priceModifier: -10, stock: 25 },
        { id: 'm', name: 'Medium', priceModifier: 0, stock: 50 },
        { id: 'l', name: 'Large', priceModifier: 15, stock: 35 },
        { id: 'xl', name: 'Extra Large', priceModifier: 30, stock: 12 },
      ],
    },
  },
  {
    id: 'lamp-002',
    name: 'Designer Table Lamp',
    description: 'Elegant table lamp with adjustable brightness and customizable color options. Combines modern aesthetics with functionality.',
    basePrice: 149,
    images: ['/products/lamp-1.jpg', '/products/lamp-2.jpg'],
    rating: 4.5,
    reviewCount: 218,
    category: 'Lighting',
    brand: 'LuxLight',
    origin: 'Denmark',
    createdAt: '2026-01-10T14:30:00.000Z',
    geometryType: 'cylinder',
    bundleEligible: ['chair-001', 'vase-003'],
    variants: {
      colors: [
        { id: 'gold', name: 'Gold', hex: '#FFD700', priceModifier: 25, stock: 18 },
        { id: 'silver', name: 'Silver', hex: '#C0C0C0', priceModifier: 20, stock: 30 },
        { id: 'bronze', name: 'Bronze', hex: '#CD7F32', priceModifier: 15, stock: 22 },
        { id: 'black', name: 'Matte Black', hex: '#1A1A1A', priceModifier: 0, stock: 45 },
        { id: 'white', name: 'Pure White', hex: '#FFFFFF', priceModifier: 0, stock: 38 },
        { id: 'rose', name: 'Rose Gold', hex: '#B76E79', priceModifier: 30, stock: 4 },
      ],
      materials: [
        { id: 'matte', name: 'Matte Finish', priceModifier: 0, stock: 95 },
        { id: 'glossy', name: 'Glossy Finish', priceModifier: 15, stock: 72 },
        { id: 'metallic', name: 'Metallic', priceModifier: 35, stock: 58 },
        { id: 'brushed', name: 'Brushed Metal', priceModifier: 40, stock: 41 },
      ],
      sizes: [
        { id: 's', name: 'Compact', priceModifier: -15, stock: 30 },
        { id: 'm', name: 'Standard', priceModifier: 0, stock: 55 },
        { id: 'l', name: 'Large', priceModifier: 20, stock: 25 },
      ],
    },
  },
  {
    id: 'vase-003',
    name: 'Modern Ceramic Vase',
    description: 'Handcrafted ceramic vase with smooth curves and contemporary design. Perfect centerpiece for any room.',
    basePrice: 89,
    images: ['/products/vase-1.jpg', '/products/vase-2.jpg'],
    rating: 4.8,
    reviewCount: 156,
    category: 'Decor',
    brand: 'Artisan Co',
    origin: 'Japan',
    createdAt: '2026-01-20T09:15:00.000Z',
    geometryType: 'lathe',
    bundleEligible: ['chair-001', 'lamp-002'],
    variants: {
      colors: [
        { id: 'terracotta', name: 'Terracotta', hex: '#E2725B', priceModifier: 0, stock: 28 },
        { id: 'navy', name: 'Navy Blue', hex: '#000080', priceModifier: 5, stock: 35 },
        { id: 'sage', name: 'Sage Green', hex: '#9CAF88', priceModifier: 5, stock: 31 },
        { id: 'cream', name: 'Cream', hex: '#FFFDD0', priceModifier: 0, stock: 42 },
        { id: 'charcoal', name: 'Charcoal', hex: '#36454F', priceModifier: 10, stock: 19 },
      ],
      materials: [
        { id: 'matte', name: 'Matte Ceramic', priceModifier: 0, stock: 88 },
        { id: 'glossy', name: 'Glossy Glaze', priceModifier: 15, stock: 64 },
        { id: 'textured', name: 'Textured Finish', priceModifier: 20, stock: 42 },
        { id: 'crackle', name: 'Crackle Glaze', priceModifier: 25, stock: 28 },
      ],
      sizes: [
        { id: 's', name: 'Small (6")', priceModifier: -10, stock: 35 },
        { id: 'm', name: 'Medium (10")', priceModifier: 0, stock: 48 },
        { id: 'l', name: 'Large (14")', priceModifier: 15, stock: 22 },
        { id: 'xl', name: 'Extra Large (18")', priceModifier: 25, stock: 8 },
      ],
    },
  },
  {
    id: 'ring-004',
    name: 'Decorative Ring Sculpture',
    description: 'Minimalist ring sculpture that adds a touch of elegance to any space. Available in various finishes.',
    basePrice: 199,
    images: ['/products/ring-1.jpg', '/products/ring-2.jpg'],
    rating: 4.6,
    reviewCount: 94,
    category: 'Sculpture',
    brand: 'ArtMetal',
    origin: 'USA',
    createdAt: '2026-01-12T16:45:00.000Z',
    geometryType: 'torus',
    bundleEligible: ['sculpture-005'],
    variants: {
      colors: [
        { id: 'gold', name: 'Polished Gold', hex: '#FFD700', priceModifier: 40, stock: 12 },
        { id: 'silver', name: 'Polished Silver', hex: '#C0C0C0', priceModifier: 35, stock: 18 },
        { id: 'copper', name: 'Copper', hex: '#B87333', priceModifier: 30, stock: 15 },
        { id: 'black', name: 'Matte Black', hex: '#1A1A1A', priceModifier: 0, stock: 24 },
        { id: 'white', name: 'Pearl White', hex: '#F8F8FF', priceModifier: 20, stock: 20 },
      ],
      materials: [
        { id: 'metallic', name: 'Polished Metal', priceModifier: 50, stock: 45 },
        { id: 'brushed', name: 'Brushed Metal', priceModifier: 45, stock: 38 },
        { id: 'matte', name: 'Matte Finish', priceModifier: 0, stock: 52 },
        { id: 'chrome', name: 'Chrome', priceModifier: 60, stock: 22 },
      ],
      sizes: [
        { id: 's', name: 'Small (8")', priceModifier: -20, stock: 28 },
        { id: 'm', name: 'Medium (12")', priceModifier: 0, stock: 35 },
        { id: 'l', name: 'Large (16")', priceModifier: 25, stock: 18 },
      ],
    },
  },
  {
    id: 'sculpture-005',
    name: 'Abstract Art Sculpture',
    description: 'Unique abstract sculpture combining multiple geometric shapes. A statement piece for art enthusiasts.',
    basePrice: 449,
    images: ['/products/sculpture-1.jpg', '/products/sculpture-2.jpg'],
    rating: 4.9,
    reviewCount: 67,
    category: 'Sculpture',
    brand: 'ModernArt Studio',
    origin: 'France',
    createdAt: '2026-01-05T11:20:00.000Z',
    geometryType: 'combined',
    bundleEligible: ['ring-004'],
    variants: {
      colors: [
        { id: 'multi', name: 'Multicolor', hex: '#FF6B6B', priceModifier: 50, stock: 8 },
        { id: 'mono', name: 'Monochrome', hex: '#2C3E50', priceModifier: 0, stock: 15 },
        { id: 'gradient', name: 'Gradient Blue', hex: '#667EEA', priceModifier: 35, stock: 10 },
        { id: 'earth', name: 'Earth Tones', hex: '#8B7355', priceModifier: 20, stock: 12 },
      ],
      materials: [
        { id: 'matte', name: 'Matte Finish', priceModifier: 0, stock: 35 },
        { id: 'glossy', name: 'High Gloss', priceModifier: 40, stock: 28 },
        { id: 'metallic', name: 'Metallic Blend', priceModifier: 75, stock: 18 },
        { id: 'textured', name: 'Textured Surface', priceModifier: 50, stock: 22 },
      ],
      sizes: [
        { id: 'm', name: 'Medium (18")', priceModifier: 0, stock: 20 },
        { id: 'l', name: 'Large (24")', priceModifier: 50, stock: 12 },
        { id: 'xl', name: 'Extra Large (36")', priceModifier: 100, stock: 3 },
      ],
    },
  },
];

// Helper function to get a product by ID
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

// Helper function to get variant by ID
export function getVariantById(product: Product, type: 'colors' | 'materials' | 'sizes', variantId: string) {
  return product.variants[type].find(v => v.id === variantId);
}
