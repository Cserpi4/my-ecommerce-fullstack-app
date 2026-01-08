// src/features/products/ProductListPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from './ProductSlice';
import ProductCard from '../../components/product/ProductCard';
import Sidebar from '../../components/layout/Sidebar';
import './ProductListPage.css';

const ProductListPage = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector(state => state.products);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  if (status === 'loading') return <div className="loading">Loading products...</div>;
  if (status === 'failed') return <div className="error">{error}</div>;

  // 🧩 Szöveg egységesítő – kisbetűsítés, többes szám kezelése, speciális karakterek törlése
  const normalize = str =>
    str
      ?.toLowerCase()
      .replace(/[-_:]/g, ' ')
      .replace(/\b(in|ins)\b/g, 'in')
      .replace(/\b(kick|kicks)\b/g, 'kick')
      .replace(/\b(corner|corners)\b/g, 'corner')
      .replace(/\b(free|freekick|free kick)\b/g, 'free kick')
      .replace(/\s+/g, ' ')
      .trim();

  // 🧠 Intelligens, kulcsszavas szűrés
  const filteredItems = selectedCategory
    ? items.filter(product => {
        const normName = normalize(product.name);
        const normCategory = normalize(selectedCategory);

        // A kategóriát kulcsszavakra bontjuk
        const categoryWords = normCategory.split(' ');

        // Minden kulcsszónak szerepelnie kell a termék nevében
        return categoryWords.every(word => normName.includes(word));
      })
    : items;

  return (
    <div className="product-page-layout">
      {/* Bal oldali kategória sáv */}
      <Sidebar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Jobb oldali terméklista */}
      <div className="product-list-page">
        <h2 className="page-title">Our Products</h2>
        <div className="product-list">
          {filteredItems.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
