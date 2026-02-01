import { create } from "zustand";
import { CartItem, SavedItem, Cart } from "@/types/cart";
import { SelectedVariants } from "@/types/product";
import { saveCart, loadCart, clearCart as clearCartDB } from "@/lib/indexedDb";
import { getCartSyncChannel } from "@/lib/broadcastChannel";
import { checkVariantStock } from "@/lib/validation";
import { getProductById } from "@/data/products";

interface CartState {
  items: CartItem[];
  savedItems: SavedItem[];
  promoCode?: string;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  addItem: (
    productId: string,
    selectedVariants: SelectedVariants,
    quantity: number,
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;

  // Save for later
  saveForLater: (itemId: string) => Promise<void>;
  moveToCart: (savedItemId: string) => Promise<void>;
  removeSavedItem: (savedItemId: string) => Promise<void>;

  // Promo code
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;

  // Persistence
  loadCartFromStorage: () => Promise<void>;
  syncFromOtherTab: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => {
  // Set up cross-tab sync
  if (typeof window !== "undefined") {
    const syncChannel = getCartSyncChannel();
    syncChannel.subscribe((message) => {
      if (message.type === "CART_UPDATED") {
        get().syncFromOtherTab();
      } else if (message.type === "CART_CLEARED") {
        set({ items: [], savedItems: [], promoCode: undefined });
      }
    });
  }

  return {
    items: [],
    savedItems: [],
    promoCode: undefined,
    isLoading: false,
    isInitialized: false,

    addItem: async (
      productId: string,
      selectedVariants: SelectedVariants,
      quantity: number,
    ) => {
      const product = getProductById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Check stock availability
      const hasStock = checkVariantStock(product, selectedVariants, quantity);
      if (!hasStock) {
        throw new Error("Insufficient stock for selected variants");
      }

      set({ isLoading: true });

      try {
        const { items } = get();

        // Check if item with same configuration already exists
        const existingItemIndex = items.findIndex(
          (item) =>
            item.productId === productId &&
            item.selectedVariants.color === selectedVariants.color &&
            item.selectedVariants.material === selectedVariants.material &&
            item.selectedVariants.size === selectedVariants.size,
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          newItems = [...items];
          const newQuantity = newItems[existingItemIndex].quantity + quantity;

          // Verify stock for new quantity
          if (!checkVariantStock(product, selectedVariants, newQuantity)) {
            throw new Error("Insufficient stock for requested quantity");
          }

          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newQuantity,
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            productId,
            selectedVariants,
            quantity,
            addedAt: new Date().toISOString(),
          };
          newItems = [...items, newItem];
        }

        const newCart: Cart = {
          items: newItems,
          savedItems: get().savedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ items: newItems });

        // Broadcast to other tabs
        getCartSyncChannel().broadcastCartUpdate();
      } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    updateQuantity: async (itemId: string, quantity: number) => {
      if (quantity < 1) {
        return get().removeItem(itemId);
      }

      set({ isLoading: true });

      try {
        const { items } = get();
        const itemIndex = items.findIndex((item) => item.id === itemId);

        if (itemIndex === -1) {
          throw new Error("Item not found in cart");
        }

        const item = items[itemIndex];
        const product = getProductById(item.productId);

        if (!product) {
          throw new Error("Product not found");
        }

        // Check stock for new quantity
        if (!checkVariantStock(product, item.selectedVariants, quantity)) {
          throw new Error("Insufficient stock for requested quantity");
        }

        const newItems = [...items];
        newItems[itemIndex] = { ...item, quantity };

        const newCart: Cart = {
          items: newItems,
          savedItems: get().savedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ items: newItems });

        getCartSyncChannel().broadcastCartUpdate();
      } catch (error) {
        console.error("Error updating quantity:", error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    removeItem: async (itemId: string) => {
      set({ isLoading: true });

      try {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);

        const newCart: Cart = {
          items: newItems,
          savedItems: get().savedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ items: newItems });

        getCartSyncChannel().broadcastCartUpdate();
      } finally {
        set({ isLoading: false });
      }
    },

    clearCart: async () => {
      set({ isLoading: true });

      try {
        await clearCartDB();
        set({ items: [], promoCode: undefined });

        getCartSyncChannel().broadcastCartClear();
      } finally {
        set({ isLoading: false });
      }
    },

    saveForLater: async (itemId: string) => {
      set({ isLoading: true });

      try {
        const { items, savedItems } = get();
        const item = items.find((i) => i.id === itemId);

        if (!item) {
          throw new Error("Item not found in cart");
        }

        const savedItem: SavedItem = {
          id: item.id,
          productId: item.productId,
          selectedVariants: item.selectedVariants,
          quantity: item.quantity,
          savedAt: new Date().toISOString(),
        };

        const newItems = items.filter((i) => i.id !== itemId);
        const newSavedItems = [...savedItems, savedItem];

        const newCart: Cart = {
          items: newItems,
          savedItems: newSavedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ items: newItems, savedItems: newSavedItems });

        getCartSyncChannel().broadcastCartUpdate();
      } finally {
        set({ isLoading: false });
      }
    },

    moveToCart: async (savedItemId: string) => {
      set({ isLoading: true });

      try {
        const { items, savedItems } = get();
        const savedItem = savedItems.find((i) => i.id === savedItemId);

        if (!savedItem) {
          throw new Error("Saved item not found");
        }

        // Check stock before moving to cart
        const product = getProductById(savedItem.productId);
        if (
          !product ||
          !checkVariantStock(
            product,
            savedItem.selectedVariants,
            savedItem.quantity,
          )
        ) {
          throw new Error("Item is out of stock");
        }

        const cartItem: CartItem = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId: savedItem.productId,
          selectedVariants: savedItem.selectedVariants,
          quantity: savedItem.quantity,
          addedAt: new Date().toISOString(),
        };

        const newItems = [...items, cartItem];
        const newSavedItems = savedItems.filter((i) => i.id !== savedItemId);

        const newCart: Cart = {
          items: newItems,
          savedItems: newSavedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ items: newItems, savedItems: newSavedItems });

        getCartSyncChannel().broadcastCartUpdate();
      } finally {
        set({ isLoading: false });
      }
    },

    removeSavedItem: async (savedItemId: string) => {
      set({ isLoading: true });

      try {
        const { savedItems } = get();
        const newSavedItems = savedItems.filter((i) => i.id !== savedItemId);

        const newCart: Cart = {
          items: get().items,
          savedItems: newSavedItems,
          promoCode: get().promoCode,
          lastUpdated: new Date().toISOString(),
        };

        await saveCart(newCart);
        set({ savedItems: newSavedItems });

        getCartSyncChannel().broadcastCartUpdate();
      } finally {
        set({ isLoading: false });
      }
    },

    applyPromoCode: (code: string) => {
      set({ promoCode: code });
    },

    removePromoCode: () => {
      set({ promoCode: undefined });
    },

    loadCartFromStorage: async () => {
      if (get().isInitialized) return;

      set({ isLoading: true });

      try {
        const cart = await loadCart();
        if (cart) {
          set({
            items: cart.items || [],
            savedItems: cart.savedItems || [],
            promoCode: cart.promoCode,
            isInitialized: true,
          });
        } else {
          set({ isInitialized: true });
        }
      } catch (error) {
        console.error("Error loading cart from storage:", error);
        set({ isInitialized: true });
      } finally {
        set({ isLoading: false });
      }
    },

    syncFromOtherTab: async () => {
      try {
        const cart = await loadCart();
        if (cart) {
          set({
            items: cart.items || [],
            savedItems: cart.savedItems || [],
            promoCode: cart.promoCode,
          });
        }
      } catch (error) {
        console.error("Error syncing cart from other tab:", error);
      }
    },
  };
});
