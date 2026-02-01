import { useState, useEffect } from "react";
import { addToRecentlyViewed, getRecentlyViewed } from "@/lib/indexedDb";

/**
 * Hook to track and retrieve recently viewed products
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = async () => {
    try {
      setIsLoading(true);
      const productIds = await getRecentlyViewed();
      setRecentlyViewed(productIds);
    } catch (error) {
      console.error("Error loading recently viewed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productId: string) => {
    try {
      await addToRecentlyViewed(productId);
      await loadRecentlyViewed();
    } catch (error) {
      console.error("Error adding to recently viewed:", error);
    }
  };

  return {
    recentlyViewed,
    isLoading,
    addProduct,
    refresh: loadRecentlyViewed,
  };
}
