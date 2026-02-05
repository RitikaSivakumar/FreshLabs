import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Wait for the DOM and the process shim to be established before rendering.
 */
const init = () => {
  const container = document.getElementById('root');

  if (!container) {
    console.error("FinComply: Root container not found.");
    return;
  }

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("FinComply: Application initialized successfully.");
  } catch (err) {
    console.error("FinComply: Failed to render app:", err);
    // Let the global error handler in index.html handle the UI feedback
    throw err;
  }
};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
