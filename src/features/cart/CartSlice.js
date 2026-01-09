// src/features/cart/CartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../apis/cart.js';

// --- Async thunks ---
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  // Expected to return either:
  // 1) Array of items
  // 2) { cartId, items }
  return await cartApi.getCart();
});

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    const state = thunkAPI.getState();
    const cartId = state.cart.cartId;
    const response = await cartApi.addItem(cartId, productId, quantity);
    return response;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity }) => {
    const response = await cartApi.updateItem(cartItemId, quantity);
    return response;
  }
);

export const removeCartItem = createAsyncThunk('cart/removeItem', async cartItemId => {
  const response = await cartApi.removeItem(cartItemId);
  return { cartItemId, ...response };
});

// --- Initial state ---
const initialState = {
  cartId: null,
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: state => {
      state.items = [];
    },
    setCartId: (state, action) => {
      state.cartId = action.payload ?? state.cartId;
    },
  },
  extraReducers: builder => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        // Support both payload shapes:
        // - array: items
        // - object: { cartId, items }
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          state.cartId = action.payload?.cartId ?? state.cartId;
          state.items = action.payload?.items ?? [];
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch cart';
      })

      // addCartItem
      .addCase(addCartItem.fulfilled, (state, action) => {
        const payload = action.payload;

        // If API returns { cartId, item } or { cartId, items }, handle it
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          state.cartId = payload.cartId ?? state.cartId;

          if (Array.isArray(payload.items)) {
            state.items = payload.items;
            return;
          }

          const item = payload.item ?? payload;
          const existing = state.items.find(i => i.id === item.id);

          if (existing) {
            // Prefer API payload quantity if provided
            existing.quantity = item.quantity ?? existing.quantity + 1;
          } else {
            state.items.push(item);
          }

          return;
        }

        // If API returns a single cart item
        const existing = state.items.find(i => i.id === payload?.id);
        if (existing) {
          existing.quantity = payload.quantity ?? existing.quantity + 1;
        } else if (payload) {
          state.items.push(payload);
        }
      })

      // updateCartItem
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const payload = action.payload;

        // If API returns { items }, replace whole list
        if (payload && typeof payload === 'object' && Array.isArray(payload.items)) {
          state.items = payload.items;
          state.cartId = payload.cartId ?? state.cartId;
          return;
        }

        // If API returns updated item
        const index = state.items.findIndex(item => item.id === payload?.id);
        if (index !== -1) state.items[index] = payload;
      })

      // removeCartItem
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.cartItemId);

        // If API returns updated items, prefer that
        if (action.payload && Array.isArray(action.payload.items)) {
          state.items = action.payload.items;
          state.cartId = action.payload.cartId ?? state.cartId;
        }
      });
  },
});

export const { clearCart, setCartId } = cartSlice.actions;

// --- Selectors ---
export const selectCartId = state => state.cart.cartId;
export const selectCartItems = state => state.cart.items;
export const selectCartLoading = state => state.cart.loading;
export const selectCartError = state => state.cart.error;

export const selectCartTotal = state =>
  state.cart.items.reduce((sum, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return sum + price * qty;
  }, 0);

export default cartSlice.reducer;
