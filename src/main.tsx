
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import { ThemeProvider } from './components/context/ThemeContext';
import { CartProvider } from './components/context/CardContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Elemento root não encontrado no HTML.');
}

createRoot(rootElement).render(
    <StrictMode>
        <ThemeProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </ThemeProvider>
    </StrictMode>
);
