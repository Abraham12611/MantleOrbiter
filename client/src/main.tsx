import { Buffer } from 'buffer';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Buffer to window object
window.Buffer = Buffer;
// Add Buffer to global scope
globalThis.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);