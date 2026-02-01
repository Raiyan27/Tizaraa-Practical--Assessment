"use client";

import { useState } from "react";
import { PriceBreakdown } from "@/lib/pricing";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CartSummaryProps {
  summary: PriceBreakdown;
  promoCode?: string;
  onApplyPromo: (code: string) => void;
  onRemovePromo: () => void;
  onCheckout: () => void;
}

export function CartSummary({
  summary,
  promoCode,
  onApplyPromo,
  onRemovePromo,
  onCheckout,
}: CartSummaryProps) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      onApplyPromo(promoInput.toUpperCase());
      setPromoError("");
    } catch (error) {
      setPromoError(
        error instanceof Error ? error.message : "Invalid promo code",
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-4">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-2 sm:space-y-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Subtotal ({summary.itemCount} items)</span>
          <PriceDisplay amount={summary.subtotal} />
        </div>

        {summary.quantityDiscount > 0 && (
          <div className="flex justify-between text-sm sm:text-base text-green-600">
            <span>Quantity Discount</span>
            <span>
              -<PriceDisplay amount={summary.quantityDiscount} />
            </span>
          </div>
        )}

        {summary.bundleDiscount > 0 && (
          <div className="flex justify-between text-sm sm:text-base text-green-600">
            <span>Bundle Discount</span>
            <span>
              -<PriceDisplay amount={summary.bundleDiscount} />
            </span>
          </div>
        )}

        {summary.promoDiscount > 0 && (
          <div className="flex justify-between text-sm sm:text-base text-green-600">
            <span>Promo Code</span>
            <span>
              -<PriceDisplay amount={summary.promoDiscount} />
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Shipping</span>
          {summary.shipping === 0 ? (
            <span className="text-green-600 font-medium">FREE</span>
          ) : (
            <PriceDisplay amount={summary.shipping} />
          )}
        </div>

        <div className="flex justify-between text-sm sm:text-base text-gray-600">
          <span>Tax</span>
          <PriceDisplay amount={summary.tax} />
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
        <span>Total</span>
        <PriceDisplay amount={summary.total} />
      </div>

      {/* Promo Code */}
      <div className="mb-4 sm:mb-6">
        {promoCode ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="success">{promoCode}</Badge>
              <span className="text-xs sm:text-sm text-gray-600">Applied</span>
            </div>
            <button
              onClick={onRemovePromo}
              className="text-sm text-red-600 hover:text-red-700 text-left sm:text-right"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError("");
                }}
                placeholder="Enter promo code"
                className="flex-1 text-sm"
              />
              <Button onClick={handleApplyPromo} variant="secondary" size="sm">
                Apply
              </Button>
            </div>
            {promoError && (
              <p className="text-xs sm:text-sm text-red-600">{promoError}</p>
            )}
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <Button onClick={onCheckout} variant="primary" className="w-full mb-3">
        Proceed to Checkout
      </Button>

      {/* Free Shipping Notice */}
      {summary.shipping > 0 && summary.subtotal < 75 && (
        <p className="text-xs sm:text-sm text-center text-gray-600">
          Add <PriceDisplay amount={75 - summary.subtotal} /> more for FREE
          shipping
        </p>
      )}
    </div>
  );
}
