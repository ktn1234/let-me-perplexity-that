import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { registerSW } from "virtual:pwa-register";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Analytics />
    <App />
  </StrictMode>
);

registerSW({ immediate: true });
