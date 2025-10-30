// Import
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Pricing from "./pages/Pricing";
import AuthModal from "./components/AuthModal";
import Account from "./pages/Account";

import { supabase} from "./services/supabaseClient";
import "./styles.css";

// Main App component
export default function App() {

  // Set up theme for light or dark mode
  const [theme, setTheme] = useState("light");

  // auth state
  const [isAuthed, setIsAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // stores user's plan / limits, loaded from Supabase `profiles`
  const [profile, setProfile] = useState(null);

  // modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // "signup" | "signin"

  // when the navbar "Sign In" / "Account" button is clicked
  const handleAuthClick = () => {
    if (!isAuthed) {
      // open modal in "signin" by default when user clicks nav button
      setAuthMode("signin");
      setShowAuthModal(true);
    } else {
      alert(`Account page coming soon for ${userEmail}`);
    }
  };

  const fetchProfileForUser = async (userId) => {
  // get their row from profiles table
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

    if (error) {
      console.error("Error loading profile:", error);
      return null;
    }
    return data;
  };

    // called from modal when user successfully signs up/signs in
  const handleAuthSuccess = async ({ email, userId }) => {
    // mark user as logged in
    setIsAuthed(true);
    setUserEmail(email || "");
    setShowAuthModal(false);

    // fetch that user's profile row
    const p = await fetchProfileForUser(userId);
    setProfile(p || null);

    console.log("Signed in as:", email, "profile:", p);
  };

  // close modal (X or background click)
  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  // let the modal flip between "signup" and "signin"
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
  };

  /**
   * This function is given to <Home />.
   * Home will call requireAuthBeforeAction(() => { do rewrite/simplify })
   *
   * If user is already authed: run the callback immediately.
   * If not authed: open modal in "signup", DO NOT run callback yet.
   *   After they sign up/sign in, you can run again manually.
   */

    // helper for protected actions like "AI-Generated" and "Simplify"
  const requireAuthBeforeAction = (actionCallback) => {
    if (isAuthed) {
      actionCallback();
    } else {
      // open the modal in signup mode by default for gated features
      setAuthMode("signup");
      setShowAuthModal(true);

      // We are NOT auto-running actionCallback yet.
      // After real auth you would run it.
      // For demo you *could* auto-run it after success if you want.
    }
  };

  return (
    // The main app container changes style based on theme
    <>
    <div className={`app-shell ${theme}`}>
      
      {/* The header stays at the top and can switch themes */}
      <Header theme={theme} setTheme={setTheme} isAuthed={isAuthed} onAuthClick={handleAuthClick} profile={profile}/>

      {/* The main area where pages will load */}
      <main className="container">
        <Routes>
          {/* When the user goes to "/", show the Home page */}
          <Route path="/" element={<Home requireAuthBeforeAction={requireAuthBeforeAction} profile={profile}/>} />

          {/* When the user goes to "/about", show the About page */}
          <Route path="/about" element={<About />} />

          {/* When the user goes to "/resume", show the Resume page */}
          <Route path="/contactus" element={<ContactUs />} />

          <Route path="/pricing" element={<Pricing />} />

          <Route path="/account" element={<Account userEmail={userEmail} profile={profile} />} />

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

      {/* Auth modal (conditionally rendered on top of everything else) */}
      
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={handleCloseModal}
          onAuthSuccess={handleAuthSuccess}
          switchMode={switchAuthMode}
        />
      )}
    </>
  );
}