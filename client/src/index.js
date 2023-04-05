import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ProductProvider } from './context/ProductContext';

const el = document.getElementById('root');
const root = createRoot(el);

root.render(
  <AuthProvider>
    <ProductProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProductProvider>
  </AuthProvider>
);
