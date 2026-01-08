import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../apis/cart.js';

// Async thunk-ok
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await cartApi.getCart();
  return response;
});

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, productId, quantity }) => {
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

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addCartItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload.cartItemId);
      });
  },
});

export default cartSlice.reducer;
