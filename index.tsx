import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Standard React mounting with additional safety checks for the project environment.
 */
const mountApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("FreshLabs: Root element #root not found.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("FreshLabs: Application mounted successfully.");
  } catch (error) {
    console.error("FreshLabs: React mount error:", error);
    rootElement.innerHTML = `
      <div style="color: #ef4444; padding: 40px; font-family: sans-serif; text-align: center; background: #020617; height: 100vh;">
        <h1 style="font-size: 24px;">Initialization Error</h1>
        <p style="color: #94a3b8;">The React application failed to mount. Check the developer console for details.</p>
      </div>
    `;
  }
};

// Ensure DOM is ready and any scripts are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}