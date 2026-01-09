// src/features/cart/CartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../apis/cart.js';

// --- Async thunks ---
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  return await cartApi.getCart(); // { success, data } where data is cart or null
});

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    // ✅ session/user cart: no cartId needed
    const resp = await cartApi.addItem(productId, quantity);

    // ✅ always re-hydrate full cart after mutation (source of truth)
    await thunkAPI.dispatch(fetchCart());

    return resp;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartItemId, quantity }, thunkAPI) => {
    const resp = await cartApi.updateItem(cartItemId, quantity);
    await thunkAPI.dispatch(fetchCart());
    return resp;
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (cartItemId, thunkAPI) => {
    const resp = await cartApi.removeItem(cartItemId);
    await thunkAPI.dispatch(fetchCart());
    return { cartItemId, ...resp };
  }
);

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
      state.cartId = null;
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

        // If backend returns null/empty for anon without session yet
        if (!cartData || typeof cartData !== 'object') {
          state.cartId = state.cartId ?? null;
          state.items = [];
          return;
        }

        state.cartId = cartData?.cartId ?? cartData?.id ?? state.cartId;
        state.items = Array.isArray(cartData?.items) ? cartData.items : [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch cart';
      })

      // addCartItem / updateCartItem / removeCartItem
      .addCase(addCartItem.pending, state => {
        state.error = null;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to add item to cart';
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to update cart item';
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.error?.message || 'Failed to remove cart item';
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
