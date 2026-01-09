import React, { useState } from 'react';
import './ProductCard.css';
import { Maximize2 } from 'lucide-react';

const ProductCard = ({ product }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Backend alap URL normalizálva: levágjuk a trailing slash-t, ha van
  const backendUrl = (
    process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3000'
  ).replace(/\/$/, '');

  // Biztosítjuk, hogy az image mindig '/'-al kezdődjön
  const imagePath = product.image
    ? product.image.startsWith('/')
      ? product.image
      : `/${product.image}`
    : null;

  // Ha nincs image, placeholdert adunk
  const imageUrl = imagePath
    ? imagePath.startsWith('/products/')
      ? imagePath
      : `${backendUrl}${imagePath}`
    : 'https://via.placeholder.com/300x300?text=No+Image';

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
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
