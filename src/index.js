import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.jsx";

// Registramos SW simple
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.warn("SW no registrado:", err));
  });
}


ReactDOM.createRoot(document.getElementById("root")).render(<App />);