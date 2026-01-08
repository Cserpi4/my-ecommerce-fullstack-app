// server/models/index.js

// User modell
import UserModel from './userModel.js';

// Product modell
import ProductModel from './productModel.js';

// Kosár és rendelés modellek
import CartModel from './cartModel.js';
import CartItemModel from './cartItemModel.js';
import OrderModel from './orderModel.js';
import OrderItemModel from './orderItemModel.js';

// Fizetés modell
import PaymentModel from './paymentModel.js';

export {
  UserModel,
  ProductModel,
  CartModel,
  CartItemModel,
  OrderModel,
  OrderItemModel,
  PaymentModel,
};
