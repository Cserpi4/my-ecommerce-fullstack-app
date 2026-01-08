import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const ordersState = useSelector(state => state.orders || {});
  const { currentOrder } = ordersState;
  const navigate = useNavigate();

  return (
    <div className="order-confirmation">
      <div className="order-confirmation-card">
        <CheckCircle size={64} color="#10b981" />
        <h2>Payment Successful!</h2>
        <p>Thank you for your order.</p>

        {currentOrder ? (
          <div className="order-details">
            <p>
              <strong>Order ID:</strong> {currentOrder.id}
            </p>
            <p>
              <strong>Total:</strong> $
              {Number(currentOrder.totalAmount || currentOrder.total || 0).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {currentOrder.status || 'Processing'}
            </p>
          </div>
        ) : (
          <p>Your order is being processed...</p>
        )}

        <button className="checkout-btn" onClick={() => navigate('/products')}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
