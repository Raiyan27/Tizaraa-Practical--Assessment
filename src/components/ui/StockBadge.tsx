import React from "react";
import { Badge } from "./Badge";

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

export function StockBadge({
  stock,
  lowStockThreshold = 5,
  className = "",
}: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="error" className={className}>
        Out of Stock
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="warning" className={className}>
        Only {stock} left
      </Badge>
    );
  }

  return (
    <Badge variant="success" className={`max-w-16 ${className}`}>
      In Stock
    </Badge>
  );
}
