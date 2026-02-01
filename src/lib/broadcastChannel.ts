type CartSyncMessage = {
  type: "CART_UPDATED" | "CART_CLEARED";
  timestamp: number;
};

class CartSyncChannel {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<(message: CartSyncMessage) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel("tizaraa-cart-sync");
      this.channel.onmessage = (event: MessageEvent<CartSyncMessage>) => {
        this.listeners.forEach((listener) => listener(event.data));
      };
    }
  }

  /**
   * Broadcast cart update to other tabs
   */
  broadcastCartUpdate(): void {
    if (this.channel) {
      const message: CartSyncMessage = {
        type: "CART_UPDATED",
        timestamp: Date.now(),
      };
      this.channel.postMessage(message);
    }
  }

  /**
   * Broadcast cart clear to other tabs
   */
  broadcastCartClear(): void {
    if (this.channel) {
      const message: CartSyncMessage = {
        type: "CART_CLEARED",
        timestamp: Date.now(),
      };
      this.channel.postMessage(message);
    }
  }

  /**
   * Subscribe to cart sync messages
   */
  subscribe(listener: (message: CartSyncMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Close the channel
   */
  close(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

// Singleton instance
let syncChannelInstance: CartSyncChannel | null = null;

export function getCartSyncChannel(): CartSyncChannel {
  if (!syncChannelInstance) {
    syncChannelInstance = new CartSyncChannel();
  }
  return syncChannelInstance;
}

export function closeCartSyncChannel(): void {
  if (syncChannelInstance) {
    syncChannelInstance.close();
    syncChannelInstance = null;
  }
}
