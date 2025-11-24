import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Index.tsx executing...');

const container = document.getElementById('root');
console.log('Root container:', container);

if (container) {
    const root = createRoot(container);
    console.log('Rendering App...');
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    console.log('App rendered');
} else {
    console.error('Failed to find the root element');
}
