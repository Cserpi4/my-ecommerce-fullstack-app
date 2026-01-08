import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

// Mock data for demonstration
const MOCK_CART_ITEMS = [
  {
    id: 1,
    name: 'Defending Throw-In Setup',
    price: 4.99,
    quantity: 1,
    image: 'http://localhost:3000/storage/attacking_throwin_final_01.jpg',
  },
  {
    id: 2,
    name: 'Attacking Corner Routine',
    price: 6.49,
    quantity: 2,
    image: 'http://localhost:3000/storage/attacking_corner_01.jpg',
  },
  {
    id: 3,
    name: 'Free-Kick Defensive Wall',
    price: 5.99,
    quantity: 1,
    image: 'http://localhost:3000/storage/defending_freekick_01.jpg',
  },
];

const CartPage = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(MOCK_CART_ITEMS);
  }, []);

  const handleRemove = id => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, quantity) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: Number(quantity) } : item))
    );
  };

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: {
        cartItems: items,
        total: totalPrice,
      },
    });
  };

  if (items.length === 0) {
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
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>

              <div className="cart-item-actions">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
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
        ))}
      </div>

      <div className="cart-summary">
        <h3 className="cart-total">Total: ${totalPrice.toFixed(2)}</h3>
        <button className="checkout-button" onClick={handleProceedToCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
