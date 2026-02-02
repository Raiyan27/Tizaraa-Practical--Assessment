import React from "react";
import { useRouter } from "next/navigation";

interface MobileBackButtonProps {
  fallbackHref?: string;
  className?: string;
}

export function MobileBackButton({
  fallbackHref = "/",
  className = "",
}: MobileBackButtonProps) {
  const router = useRouter();

  const handleGoBack = () => {
    // Try to go back in history, fallback to provided href if at root
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      aria-label="Go back to previous page"
      type="button"
    >
      <svg
        className="w-5 h-5 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}
