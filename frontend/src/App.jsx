// Import
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import "./styles.css";

// Main App component
export default function App() {

  // Set up theme for light or dark mode
  const [theme, setTheme] = React.useState("light");
  const [isAuthed, setIsAuthed] = useState(false);

  // when the navbar "Sign In" / "Account" button is clicked
  const handleAuthClick = () => {
    if (!isAuthed) {
      // not signed in yet
      const wantsToSignIn = window.confirm(
        "You need an account to continue.\n\nDo you already have an account?\n\nOK = Sign In\nCancel = Sign Up"
      );

      if (wantsToSignIn) {
        // pretend we signed them in
        alert("Sign in flow (coming soon). For now we'll mark you as signed in.");
        setIsAuthed(true);
      } else {
        alert("Sign up flow (coming soon). We'll create your account and sign you in.");
        setIsAuthed(true);
      }
    } else {
      // already signed in
      alert("Account page coming soon (usage, billing, etc.)");
    }
  };

    // helper for protected actions like "AI-Generated" and "Simplify"
  const requireAuthBeforeAction = (actionCallback) => {
    if (!isAuthed) {
      const wantsToSignIn = window.confirm(
        "You need an account to use this feature.\n\nDo you already have an account?\n\nOK = Sign In\nCancel = Sign Up"
      );

      if (wantsToSignIn) {
        alert("Sign in flow (coming soon). Marking you signed in now.");
        setIsAuthed(true);
      } else {
        alert("Sign up flow (coming soon). Marking you signed in now.");
        setIsAuthed(true);
      }

      // after this, user is considered signed in, continue
      actionCallback();
      return;
    }

    // already signed in, just run it
    actionCallback();
  };

  return (
    // The main app container changes style based on theme
    <div className={`app-shell ${theme}`}>
      
      {/* The header stays at the top and can switch themes */}
      <Header theme={theme} setTheme={setTheme} isAuthed={isAuthed} onAuthClick={handleAuthClick}/>

      {/* The main area where pages will load */}
      <main className="container">
        <Routes>
          {/* When the user goes to "/", show the Home page */}
          <Route path="/" element={<Home requireAuthBeforeAction={requireAuthBeforeAction}/>} />

          {/* When the user goes to "/about", show the About page */}
          <Route path="/about" element={<About />} />

          {/* When the user goes to "/resume", show the Resume page */}
          <Route path="/contactus" element={<ContactUs />} />

          <Route path="/pricing" element={<Pricing />} />

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