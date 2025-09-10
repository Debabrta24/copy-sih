import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      // Service worker registered successfully
    } catch (registrationError) {
      // Service worker registration failed
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
