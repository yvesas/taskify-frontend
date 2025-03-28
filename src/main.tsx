import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

export const setupGlobalErrorHandling = () => {
  // WARN: Captura erros não tratados no  - geral
  window.addEventListener("error", (event) => {
    console.error("Uncaught error:", event.error);
    // // FIXME: enviar a um serviço de monitoramento
  });

  // WARN: Captura rejeições de promises não tratadas
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    // FIXME: enviar a um serviço de monitoramento
    event.preventDefault();
  });
};

setupGlobalErrorHandling();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
