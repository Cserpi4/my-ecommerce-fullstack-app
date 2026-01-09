// src/features/cart/CartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../apis/cart.js';

// --- Async thunks ---
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await cartApi.getCart(); // returns { success, data }
});

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    const state = thunkAPI.getState();
    let cartId = state.cart.cartId;

    // If cartId missing, fetch cart and extract it from payload.data
    if (!cartId) {
      const cartResp = await cartApi.getCart(); // { success, data }
      const cartData = cartResp?.data;

      cartId = cartData?.cartId ?? cartData?.id ?? null;

      if (!cartId) {
        cartId = null;
      }

      thunkAPI.dispatch(setCartId(cartId));
      // Optional: also hydrate items if present
      if (Array.isArray(cartData?.items)) {
        thunkAPI.dispatch(setCartItems(cartData.items));
      }
    }

    return await cartApi.addItem(cartId, productId, quantity); // returns { success, data }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity }) => {
    return await cartApi.updateItem(cartItemId, quantity); // returns { success, data }
  }
);

export const removeCartItem = createAsyncThunk('cart/removeItem', async cartItemId => {
  const response = await cartApi.removeItem(cartItemId); // returns { success, data }
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
    setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : state.items;
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

        const payload = action.payload; // { success, data }
        const cartData = payload?.data;

        // cartData can be { cartId, items } OR just items array
        if (Array.isArray(cartData)) {
          state.items = cartData;
          return;
        }

        state.cartId = cartData?.cartId ?? cartData?.id ?? state.cartId;
        state.items = cartData?.items ?? [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch cart';
      })

      // addCartItem
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to add item to cart';
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        const payload = action.payload; // { success, data }
        const data = payload?.data;

        // If API returns { cartId, items }
        if (data && typeof data === 'object' && Array.isArray(data.items)) {
          state.cartId = data.cartId ?? data.id ?? state.cartId;
          state.items = data.items;
          return;
        }

        // If API returns a single cart item in data
        const item = data ?? null;
        if (!item) return;

        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          existing.quantity = item.quantity ?? existing.quantity;
        } else {
          state.items.push(item);
        }
      })

      // updateCartItem
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const payload = action.payload; // { success, data }
        const data = payload?.data;

        if (data && typeof data === 'object' && Array.isArray(data.items)) {
          state.cartId = data.cartId ?? data.id ?? state.cartId;
          state.items = data.items;
          return;
        }

        const updated = data ?? null;
        if (!updated) return;

        const index = state.items.findIndex(i => i.id === updated.id);
        if (index !== -1) state.items[index] = updated;
      })

      // removeCartItem
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.cartItemId);

        const data = action.payload?.data;
        if (data && typeof data === 'object' && Array.isArray(data.items)) {
          state.cartId = data.cartId ?? data.id ?? state.cartId;
          state.items = data.items;
        }
      });
  },
});

export const { clearCart, setCartId, setCartItems } = cartSlice.actions;

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
