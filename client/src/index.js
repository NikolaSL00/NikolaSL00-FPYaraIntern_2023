import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { Provider as ContextProvider } from './context/AuthContext';

const el = document.getElementById('root');
const root = createRoot(el);

root.render(
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider>
);
