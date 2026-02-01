"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { calculateCartSummary } from "@/lib/pricing";
import { getPromoCodeByCode } from "@/data/promo-codes";
import { CartItem } from "@/components/cart/CartItem";
import { SavedItem } from "@/components/cart/SavedItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    savedItems,
    promoCode,
    isLoading,
    isInitialized,
    updateQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyPromoCode,
    removePromoCode,
    loadCartFromStorage,
  } = useCartStore();

  // Load cart from IndexedDB on mount
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  const handleApplyPromo = (code: string) => {
    const promo = getPromoCodeByCode(code);
    if (!promo) {
      throw new Error("Invalid promo code");
    }
    applyPromoCode(code);
  };

  const handleCheckout = () => {
    alert("Checkout functionality coming soon!");
  };

  // Calculate cart summary
  const summary = calculateCartSummary(items, promoCode);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0 && savedItems.length === 0;
  const hasCartItems = items.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>
            {hasCartItems && (
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {summary.itemCount} item{summary.itemCount !== 1 ? "s" : ""} in
                your cart
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/")}
          >
            Continue Shopping
          </Button>
        </div>

        {isEmpty ? (
          /* Empty Cart */
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Looks like you have not added anything to your cart yet.
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push("/")}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        ) : (
          /* Cart with Items */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              {hasCartItems && (
                <>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={(quantity) =>
                        updateQuantity(item.id, quantity)
                      }
                      onRemove={() => removeItem(item.id)}
                      onSaveForLater={() => saveForLater(item.id)}
                    />
                  ))}
                </>
              )}

              {/* Saved Items */}
              {savedItems.length > 0 && (
                <div className={hasCartItems ? "mt-6 sm:mt-8" : ""}>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Saved for Later ({savedItems.length})
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {savedItems.map((item) => (
                      <SavedItem
                        key={item.id}
                        item={item}
                        onMoveToCart={() => moveToCart(item.id)}
                        onRemove={() => removeSavedItem(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {hasCartItems && (
              <div className="lg:col-span-1">
                <CartSummary
                  summary={summary}
                  promoCode={promoCode}
                  onApplyPromo={handleApplyPromo}
                  onRemovePromo={removePromoCode}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
