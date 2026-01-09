import React, { useState } from 'react';
import './ProductCard.css';
import { Maximize2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addCartItem } from '../../features/cart/CartSlice'; // <-- igazítsd, ha máshol van

const ProductCard = ({ product }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dispatch = useDispatch();

  const backendUrl = (process.env.REACT_APP_API_URL || 'http://localhost:3000').replace(/\/$/, '');

  const imagePath = product.image
    ? product.image.startsWith('/')
      ? product.image
      : `/${product.image}`
    : null;

  const imageUrl = imagePath
    ? imagePath.startsWith('/products/')
      ? imagePath
      : `${backendUrl}${imagePath}`
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const handleAddToCart = () => {
    dispatch(addCartItem({ productId: product.id, quantity: 1 }));
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img src={imageUrl} alt={product.name} className="product-image" />
        </div>

        <button
          className="fullscreen-btn"
          onClick={() => setIsFullscreen(true)}
          title="View fullscreen"
        >
          <Maximize2 size={18} />
        </button>

        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-description">{product.description}</p>}
        {product.price !== undefined && (
          <p className="product-price">${Number(product.price).toFixed(2)}</p>
        )}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>

      {isFullscreen && (
        <div className="fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <div className="fullscreen-card" onClick={e => e.stopPropagation()}>
            <div className="fullscreen-header">
              <h3 className="fullscreen-title">{product.name}</h3>
              <button className="close-btn" onClick={() => setIsFullscreen(false)}>
                &times;
              </button>
            </div>

            <img src={imageUrl} alt={product.name} className="fullscreen-image" />

            <div className="fullscreen-info">
              {product.description && <p>{product.description}</p>}
              {product.price !== undefined && (
                <p className="info-price">${Number(product.price).toFixed(2)}</p>
              )}
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to cart
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
