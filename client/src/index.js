import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './ContextApi/auth-context';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeContextProvider, { ThemeContext } from './components/ThemeContext';
import { LanguageContextProvider } from './components/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <AuthProvider >
    <ThemeContextProvider>
      <LanguageContextProvider>
         <App />
      </LanguageContextProvider>
    </ThemeContextProvider>
  </AuthProvider>
);
