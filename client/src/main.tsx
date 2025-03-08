import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add polyfills for ethers.js
if (typeof window !== 'undefined') {
  // Buffer polyfill
  window.global = window;
  window.Buffer = window.Buffer || require('buffer').Buffer;
}

createRoot(document.getElementById("root")!).render(<App />);