import React from 'react';

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  showCents?: boolean;
}

export function PriceDisplay({ 
  amount, 
  currency = 'USD', 
  className = '',
  showCents = true 
}: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);

  return (
    <span className={`font-semibold ${className}`}>
      {formatted}
    </span>
  );
}
