
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "sonner";
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" closeButton richColors />
  </React.StrictMode>
);
