import { Buffer } from 'buffer';
import * as util from 'util';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Polyfill setup
window.Buffer = Buffer;
window.process = { env: {} };
window.util = util;

createRoot(document.getElementById("root")!).render(<App />);