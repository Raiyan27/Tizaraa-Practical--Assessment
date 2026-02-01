import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Cart } from "@/types/cart";

interface TizaraaDB extends DBSchema {
  cart: {
    key: string;
    value: Cart;
  };
  recentlyViewed: {
    key: string;
    value: {
      productId: string;
      viewedAt: string;
    };
  };
}

const DB_NAME = "tizaraa-store";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<TizaraaDB> | null = null;

/**
 * Initialize and get database instance
 */
async function getDB(): Promise<IDBPDatabase<TizaraaDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<TizaraaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create cart store
      if (!db.objectStoreNames.contains("cart")) {
        db.createObjectStore("cart");
      }

      // Create recently viewed store
      if (!db.objectStoreNames.contains("recentlyViewed")) {
        db.createObjectStore("recentlyViewed");
      }
    },
  });

  return dbInstance;
}

/**
 * Save cart to IndexedDB
 */
export async function saveCart(cart: Cart): Promise<void> {
  try {
    const db = await getDB();
    await db.put("cart", cart, "current");
  } catch (error) {
    console.error("Error saving cart to IndexedDB:", error);
    throw error;
  }
}

/**
 * Load cart from IndexedDB
 */
export async function loadCart(): Promise<Cart | null> {
  try {
    const db = await getDB();
    const cart = await db.get("cart", "current");
    return cart || null;
  } catch (error) {
    console.error("Error loading cart from IndexedDB:", error);
    return null;
  }
}

/**
 * Clear cart from IndexedDB
 */
export async function clearCart(): Promise<void> {
  try {
    const db = await getDB();
    await db.delete("cart", "current");
  } catch (error) {
    console.error("Error clearing cart from IndexedDB:", error);
    throw error;
  }
}

/**
 * Add product to recently viewed
 */
export async function addToRecentlyViewed(productId: string): Promise<void> {
  try {
    const db = await getDB();
    const viewedAt = new Date().toISOString();
    await db.put("recentlyViewed", { productId, viewedAt }, productId);

    // Keep only last 10 items
    const allViewed = await db.getAllKeys("recentlyViewed");
    if (allViewed.length > 10) {
      // Get all items with timestamps
      const items = await Promise.all(
        allViewed.map(async (key) => ({
          key,
          data: await db.get("recentlyViewed", key),
        })),
      );

      // Sort by viewedAt and keep newest 10
      items.sort((a, b) => {
        const dateA = new Date(a.data?.viewedAt || 0);
        const dateB = new Date(b.data?.viewedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      // Delete older items
      for (const item of items.slice(10)) {
        await db.delete("recentlyViewed", item.key);
      }
    }
  } catch (error) {
    console.error("Error adding to recently viewed:", error);
  }
}

/**
 * Get recently viewed products
 */
export async function getRecentlyViewed(): Promise<string[]> {
  try {
    const db = await getDB();
    const keys = await db.getAllKeys("recentlyViewed");
    const items = await Promise.all(
      keys.map(async (key) => ({
        productId: key,
        data: await db.get("recentlyViewed", key),
      })),
    );

    // Sort by viewedAt (newest first)
    items.sort((a, b) => {
      const dateA = new Date(a.data?.viewedAt || 0);
      const dateB = new Date(b.data?.viewedAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return items.map((item) => item.productId);
  } catch (error) {
    console.error("Error getting recently viewed:", error);
    return [];
  }
}

/**
 * Clear recently viewed
 */
export async function clearRecentlyViewed(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear("recentlyViewed");
  } catch (error) {
    console.error("Error clearing recently viewed:", error);
    throw error;
  }
}
