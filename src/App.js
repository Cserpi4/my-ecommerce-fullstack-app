import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import Header from './components/layout/Header.jsx';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import { initCsrf } from './apis/client';

export default function App() {
  useEffect(() => {
    // 🔐 Mock token – csak fejlesztési környezetben
    localStorage.setItem('accessToken', 'mock-token');

    // 🧩 CSRF token inicializálás
    initCsrf();
  }, []);

  return (
    <Provider store={store}>
      <Header />
      <main className="p-4">
        <AppRoutes />
      </main>
    </Provider>
  );
}
