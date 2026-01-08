import React, { useState, useCallback } from 'react';
import './ImageZoom.css';

const ImageZoom = ({ src, alt, name, description, price }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleZoom = useCallback(e => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  }, []);

  return (
    <>
      <div className="image-zoom-container" onClick={toggleZoom}>
        <img src={src} alt={alt} className="zoomable-image" loading="lazy" />
      </div>

      {isOpen && (
        <div className="image-overlay fade-in" onClick={toggleZoom}>
          <div className="image-overlay-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={toggleZoom}>
              &times;
            </button>

            <img src={src} alt={alt} className="zoomed-image scale-up" loading="lazy" />

            <div className="image-info-panel slide-up">
              <h3 className="info-name">{name}</h3>
              {description && <p className="info-description">{description}</p>}
              {price !== undefined && <p className="info-price">${Number(price).toFixed(2)}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(ImageZoom);
