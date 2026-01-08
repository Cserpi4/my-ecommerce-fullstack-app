import CartService from '../../services/cartService.js';
import pool from '../../config/db.js';

// Mock PostgreSQL pool query
jest.mock('../../config/db.js', () => ({
  query: jest.fn(),
}));

describe('CartService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCartItems', () => {
    it('should return cart items for a given user', async () => {
      const mockRows = [{ id: 1, user_id: 1, product_id: 2, quantity: 3, price: 19.99 }];
      pool.query.mockResolvedValue({ rows: mockRows });

      const result = await CartService.getCartItems(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [1]);
      expect(result).toEqual(mockRows);
    });
  });

  describe('addCartItem', () => {
    it('should add a new item to the cart', async () => {
      const newItem = { userId: 1, productId: 2, quantity: 2 };
      const mockResult = { rows: [{ id: 1, ...newItem, price: 9.99 }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await CartService.addCartItem(newItem);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO cart'), [
        newItem.userId,
        newItem.productId,
        newItem.quantity,
      ]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('updateCartItem', () => {
    it('should update quantity of a cart item', async () => {
      const updatedItem = { cartItemId: 1, quantity: 5 };
      const mockResult = { rows: [{ id: 1, quantity: 5 }] };
      pool.query.mockResolvedValue(mockResult);

      const result = await CartService.updateCartItem(updatedItem);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE cart'), [
        updatedItem.quantity,
        updatedItem.cartItemId,
      ]);
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('removeCartItem', () => {
    it('should delete a cart item by id', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const result = await CartService.removeCartItem(1);

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM cart'), [1]);
      expect(result).toEqual(1);
    });
  });
});
