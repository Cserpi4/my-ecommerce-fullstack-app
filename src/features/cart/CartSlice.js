import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartApi from "../../apis/cartApi.js";

// --- Async thunks ---

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  return await cartApi.getCart();
});

export const addCartItem = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity = 1 }, thunkAPI) => {
    const resp = await cartApi.addItem(productId, quantity);

    const cartId =
      resp?.data?.cart?.id ??
      resp?.cart?.id ??
      resp?.data?.cartId ??
      resp?.cartId ??
      null;

    if (cartId) {
      localStorage.setItem("cartId", String(cartId));
      thunkAPI.dispatch(setCartId(cartId));
    }

    await thunkAPI.dispatch(fetchCart());

    return resp;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ cartItemId, quantity }, thunkAPI) => {
    const resp = await cartApi.updateItem(cartItemId, quantity);
    await thunkAPI.dispatch(fetchCart());
    return resp;
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId, thunkAPI) => {
    const resp = await cartApi.removeItem(cartItemId);
    await thunkAPI.dispatch(fetchCart());
    return { cartItemId, ...resp };
  }
);

// --- Initial state ---

const initialState = {
  cartId: localStorage.getItem("cartId"),
  items: [],
  loading: false,
  error: null,
};

// --- Slice ---

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.cartId = null;
      localStorage.removeItem("cartId");
    },
    setCartId(state, action) {
      if (action.payload) {
        state.cartId = action.payload;
        localStorage.setItem("cartId", String(action.payload));
      }
    },
    setCartItems(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : state.items;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetchCart ---
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        const cartData =
          payload?.data?.cart ??
          payload?.data ??
          payload?.cart ??
          null;

        if (!cartData || typeof cartData !== "object") {
          state.items = [];
          return;
        }

        const newCartId = cartData?.id ?? cartData?.cartId ?? null;

        if (newCartId) {
          state.cartId = newCartId;
          localStorage.setItem("cartId", String(newCartId));
        }

        state.items = Array.isArray(cartData?.items) ? cartData.items : [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch cart";
      })

      // --- mutation errors ---
      .addCase(addCartItem.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to add item to cart";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to update cart item";
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.error = action.error?.message || "Failed to remove cart item";
      });
  },
});

// --- Exports ---

export const { clearCart, setCartId, setCartItems } = cartSlice.actions;

export const selectCartId = (state) => state.cart.cartId;
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => {
    const price = Number(item.unit_price ?? item.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return sum + price * qty;
  }, 0);

export default cartSlice.reducer;
