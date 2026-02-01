import { SelectedVariants } from "./product";

export interface CartItem {
  id: string; // Unique cart item ID
  productId: string;
  selectedVariants: SelectedVariants;
  quantity: number;
  customizations?: Record<string, unknown>;
  addedAt: string; // ISO timestamp
}

export interface SavedItem extends Omit<CartItem, "id"> {
  id: string;
  savedAt: string; // ISO timestamp
}

export interface Cart {
  items: CartItem[];
  savedItems: SavedItem[];
  promoCode?: string;
  lastUpdated: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}
