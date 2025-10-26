// Import
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import "./styles.css";

// Main App component
export default function App() {

  // Set up theme for light or dark mode
  const [theme, setTheme] = React.useState("light");

  return (
    // The main app container changes style based on theme
    <div className={`app-shell ${theme}`}>
      
      {/* The header stays at the top and can switch themes */}
      <Header theme={theme} setTheme={setTheme} />

      {/* The main area where pages will load */}
      <main className="container">
        <Routes>
          {/* When the user goes to "/", show the Home page */}
          <Route path="/" element={<Home />} />

          {/* When the user goes to "/about", show the About page */}
          <Route path="/about" element={<About />} />

          {/* When the user goes to "/resume", show the Resume page */}
          <Route path="/contactus" element={<ContactUs />} />

          {/* If the user goes to a page that doesn’t exist, show this message */}
          <Route
            path="*"
            element={<div style={{ padding: 16 }}>Not Found</div>}
          />
        </Routes>
      </main>

      {/* The footer stays at the bottom of every page */}
      <Footer />
    </div>
  );
}