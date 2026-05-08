import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// ❌ Hemos eliminado la importación de index.css que causaba el error
import App from "./App.tsx";

// Vite busca el div con id 'root' en tu index.html para renderizar React
const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}