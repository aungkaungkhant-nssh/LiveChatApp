import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import NotificationProvider from './context/NotificationProvider';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider>
          <App />
      </NotificationProvider>
    </AuthProvider>
    
  </BrowserRouter>
);

reportWebVitals();
