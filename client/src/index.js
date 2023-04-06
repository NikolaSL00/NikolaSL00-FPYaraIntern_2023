import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { Provider as AuthProvider } from './context/AuthContext';
import { Provider as ProductProvider } from './context/ProductContext';
import { Provider as WarehouseProvider } from './context/WarehouseContext';

const el = document.getElementById('root');
const root = createRoot(el);

root.render(
  <AuthProvider>
    <WarehouseProvider>
      <ProductProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ProductProvider>
    </WarehouseProvider>
  </AuthProvider>
);
