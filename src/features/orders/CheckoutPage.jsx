import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder } from "./OrderSlice";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import paymentApi from "../../apis/paymentApi.js";
import "./CheckoutPage.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// --- Checkout Form ---
const CheckoutForm = ({ orderData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: "if_required",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    dispatch(
      createOrder({
        cartId: orderData.cartId,
      })
    );

    navigate("/order-success");
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>💳 Payment Details</h3>
      <PaymentElement />
      {error && <p className="payment-error">⚠️ {error}</p>}
      <button disabled={loading || !stripe} className="checkout-btn">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// --- Checkout Page ---
const CheckoutPage = () => {
  const location = useLocation();
  const { cartItems = [], total = 0 } = location.state || {};
  const cartId = localStorage.getItem("cartId");

  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await paymentApi.createPayment();
      setClientSecret(data.payment.client_secret);
      setShowPayment(true);
    } catch (err) {
      console.error("PaymentIntent error (status):", err?.response?.status);
      console.error("PaymentIntent error (data):", err?.response?.data);
      console.error("PaymentIntent error (message):", err?.message);

      alert(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Hiba történt a fizetési előkészítésnél."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      {!showPayment ? (
        <form className="shipping-form" onSubmit={handleContinue}>
          <h3>Shipping Information</h3>

          {Object.keys(shipping).map((key) => (
            <input
              key={key}
              name={key}
              placeholder={key.replace(/([A-Z])/g, " $1")}
              value={shipping[key]}
              onChange={handleChange}
              required
            />
          ))}

          <div className="checkout-summary">
            <h4>Total: ${total.toFixed(2)}</h4>
            <p>{cartItems.length} item(s) in your cart</p>
          </div>

          <button type="submit" className="checkout-btn" disabled={loading}>
            {loading ? "Preparing Payment..." : "Continue to Payment"}
          </button>
        </form>
      ) : (
        clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm orderData={{ ...shipping, total, cartItems, cartId }} />
          </Elements>
        )
      )}
    </div>
  );
};

export default CheckoutPage;
