import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice.js';
import productReducer from '../features/products/ProductSlice.js';
import cartReducer from '../features/cart/CartSlice.js';
import orderReducer from '../features/orders/OrderSlice.js';
import userReducer from '../features/user/UserSlice.js';
import welcomeReducer from '../features/welcome/WelcomeSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
  user: userReducer,
  welcome: welcomeReducer,
});

export default rootReducer;
