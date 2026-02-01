import { useCartStore } from '../store/cartStore';
import { CartItem } from '../types/cart';
import { getProductById } from '../data/products';

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset cart before each test
    useCartStore.getState().clearCart();
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].productId).toBe('chair-001');
      expect(items[0].quantity).toBe(1);
    });

    it('should increase quantity if same item already exists', async () => {
      const store = useCartStore.getState();
      const variants = {
        color: 'red',
        material: 'matte',
        size: 'm',
      };

      await store.addItem('chair-001', variants, 1);
      await store.addItem('chair-001', variants, 2);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(3);
    });

    it('should add separate item if variants are different', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      await store.addItem('chair-001', {
        color: 'blue',
        material: 'matte',
        size: 'm',
      }, 1);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(2);
    });

    it('should throw error if product not found', async () => {
      const store = useCartStore.getState();

      await expect(
        store.addItem('invalid-product', {
          color: 'red',
          material: 'matte',
          size: 'm',
        }, 1)
      ).rejects.toThrow('Product not found');
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const itemId = useCartStore.getState().items[0].id;
      await store.updateQuantity(itemId, 5);

      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is less than 1', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const itemId = useCartStore.getState().items[0].id;
      await store.updateQuantity(itemId, 0);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const itemId = useCartStore.getState().items[0].id;
      await store.removeItem(itemId);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('saveForLater', () => {
    it('should move item from cart to saved items', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const itemId = useCartStore.getState().items[0].id;
      await store.saveForLater(itemId);

      const { items, savedItems } = useCartStore.getState();
      expect(items).toHaveLength(0);
      expect(savedItems).toHaveLength(1);
      expect(savedItems[0].productId).toBe('chair-001');
    });
  });

  describe('moveToCart', () => {
    it('should move item from saved items to cart', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      const itemId = useCartStore.getState().items[0].id;
      await store.saveForLater(itemId);

      const savedItemId = useCartStore.getState().savedItems[0].id;
      await store.moveToCart(savedItemId);

      const { items, savedItems } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(savedItems).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const store = useCartStore.getState();

      await store.addItem('chair-001', {
        color: 'red',
        material: 'matte',
        size: 'm',
      }, 1);

      await store.clearCart();

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });
});
