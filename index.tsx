import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Could not find root element with ID 'root'. Check your index.html.");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("FreshLabs: Application mounted successfully.");
  } catch (error) {
    console.error("FreshLabs: Initialization Failed", error);
    rootElement.innerHTML = `
      <div style="color: white; padding: 40px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #ef4444;">Initialization Error</h1>
        <p>The application failed to load. Please ensure you are running a local development server (like Vite or Live Server with transpilation support) and check the browser console for details.</p>
      </div>
    `;
  }
}