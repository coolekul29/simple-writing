// Import React so we can use JSX and components
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

// Find the <div> with id="root" in index.html where the app will show up
const root = createRoot(document.getElementById("root"));

// Render the app inside the root element
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
