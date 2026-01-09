// src/features/cart/CartPage.jsx
import React, { useEffect } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './CartPage.css';

import {
  fetchCart,
  updateCartItem,
  removeCartItem,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotal,
} from './CartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const totalPrice = useSelector(selectCartTotal);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = cartItemId => {
    dispatch(removeCartItem(cartItemId));
  };

  const handleQuantityChange = (cartItemId, quantity) => {
    dispatch(updateCartItem({ cartItemId, quantity: Number(quantity) }));
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: items,
        total: totalPrice,
      },
    });
  };

  if (loading) {
    return <div className="cart-page">Loading cart...</div>;
  }

  if (error) {
    return <div className="cart-page">Cart error: {error}</div>;
  }

  if (!items.length) {
    return (
      <div className="empty-cart">
        <ShoppingBag size={48} />
        <p>Your cart is currently empty.</p>
        <button className="go-shop-btn" onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart</h2>

      <div className="cart-items">
        {items.map(item => {
          // Support both item shapes:
          // 1) flattened: { id, name, price, image, quantity }
          // 2) nested: { id, quantity, product: { name, price, image } }
          const name = item.name ?? item.product?.name ?? 'Item';
          const price = Number(item.price ?? item.product?.price ?? 0);
          const image = item.image ?? item.product?.image ?? null;

          return (
            <div key={item.id} className="cart-item">
              <img
                src={image || 'https://via.placeholder.com/300x300?text=No+Image'}
                alt={name}
                className="cart-item-image"
              />

              <div className="cart-item-info">
                <h3 className="cart-item-name">{name}</h3>
                <p className="cart-item-price">${price.toFixed(2)}</p>

                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity ?? 1}
                    onChange={e => handleQuantityChange(item.id, e.target.value)}
                    className="cart-item-quantity"
                  />

                  <button className="cart-item-remove" onClick={() => handleRemove(item.id)}>
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3 className="cart-total">Total: ${Number(totalPrice).toFixed(2)}</h3>
        <button className="checkout-button" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
