import reducer, {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '../../features/cart/CartSlice';

describe('CartSlice', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  test('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  test('should handle fetchCart.pending', () => {
    const state = reducer(initialState, { type: fetchCart.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('should handle fetchCart.fulfilled', () => {
    const mockItems = [{ id: 1, name: 'Product 1' }];
    const state = reducer(initialState, { type: fetchCart.fulfilled.type, payload: mockItems });
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockItems);
  });

  test('should handle fetchCart.rejected', () => {
    const state = reducer(initialState, {
      type: fetchCart.rejected.type,
      error: { message: 'Error!' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Error!');
  });

  test('should handle addCartItem.fulfilled', () => {
    const product = { id: 2, name: 'Product 2' };
    const state = reducer(initialState, { type: addCartItem.fulfilled.type, payload: product });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(product);
  });

  test('should handle updateCartItem.fulfilled', () => {
    const initial = { ...initialState, items: [{ id: 3, quantity: 1 }] };
    const updated = { id: 3, quantity: 5 };
    const state = reducer(initial, { type: updateCartItem.fulfilled.type, payload: updated });
    expect(state.items[0].quantity).toBe(5);
  });

  test('should handle removeCartItem.fulfilled', () => {
    const initial = { ...initialState, items: [{ id: 4 }, { id: 5 }] };
    const state = reducer(initial, {
      type: removeCartItem.fulfilled.type,
      payload: { cartItemId: 4 },
    });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(5);
  });
});
