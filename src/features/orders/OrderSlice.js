// src/features/orders/OrderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderApi from '../../apis/order.js';

// --- Create new order (pl. Stripe fizetés után)
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

// --- Fetch all orders (pl. user rendelései)
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrders();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
    }
  }
);

// --- Fetch specific order items
export const fetchOrderItems = createAsyncThunk(
  'orders/fetchOrderItems',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderApi.getOrderItems(orderId);
      return { orderId, items: response };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load order items');
    }
  }
);

// --- Add new item to existing order (admin or test)
export const addOrderItem = createAsyncThunk(
  'orders/addOrderItem',
  async (orderItemData, { rejectWithValue }) => {
    try {
      const response = await orderApi.addOrderItem(orderItemData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add order item');
    }
  }
);

// --- Initial state
const initialState = {
  orders: [],
  currentOrder: null, // ✅ kell a success page-hez
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: state => {
      state.currentOrder = null;
    },
  },
  extraReducers: builder => {
    builder
      // --- Fetch orders
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Create new order
      .addCase(createOrder.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload; // ✅ success page
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch order items
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload.orderId);
        if (order) order.items = action.payload.items;
      })

      // --- Add order item
      .addCase(addOrderItem.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload.orderId);
        if (order) {
          if (!order.items) order.items = [];
          order.items.push(action.payload);
        }
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
