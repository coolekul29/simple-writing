// src/components/AuthModal.jsx
import React, { useState } from "react";
import "../styles/authmodal.css";
import { supabase } from "../services/supabaseClient";

export default function AuthModal({
  mode,                // "signup" or "signin"
  onClose,             // called when user clicks X or background
  onAuthSuccess,       // called after fake submit, should set isAuthed=true
  switchMode,          // lets you flip between signup/signin
}) {
  // local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isSignUp = mode === "signup";

  const handleSubmit = async(e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      if (isSignUp) {
        // Sign Up flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (!error && data?.user) {
              const rewriteLimit = parseInt(process.env.REACT_APP_TIER1_DAILY_REWRITE_LIMIT || "10", 10);
              const maxWords = parseInt(process.env.REACT_APP_TIER1_MAX_WORDS || "100", 10);
              const { error: profileError } = await supabase
                .from("profiles")
                .insert([
                  {
                    id: data.user.id,
                    tier: "tier1",
                    daily_rewrites_used: 0,
                    rewrite_limit_per_day: rewriteLimit,
                    max_words_per_input: maxWords,
                  },
                ]);

              if (profileError) {
                console.error("Profile creation failed:", profileError);
              } else {
                console.log("Profile created for new user:", data.user.email);
              }
            }

        if (error) {
          setErrorMsg(error.message || "Sign up failed.");
        } else {
          // data.user is the created user
          onAuthSuccess({
            email: data.user?.email,
            userId: data.user?.id,
          });
        }
      } else {
        // Sign In flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message || "Sign in failed.");
        } else {
          onAuthSuccess({
            email: data.user?.email,
            userId: data.user?.id,
          });
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* dimmed blurred background overlay */}
      <div className="auth-overlay" onClick={onClose}></div>

      {/* modal card */}
      <div className="auth-modal-card">
        <div className="auth-modal-header">
          <h2>{isSignUp ? "Create your account" : "Sign in"}</h2>
          <button className="auth-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="auth-modal-sub">
          {isSignUp
            ? "Sign up to start using Simple Writing."
            : "Welcome back."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Email *</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label>Password *</label>
            <input
              type="password"
              required
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {errorMsg && (
            <div className="auth-error-text">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? (isSignUp ? "Signing up..." : "Signing in...")
              : (isSignUp ? "Sign Up" : "Sign In")}
          </button>
        </form>

        <div className="auth-switch-text">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => switchMode("signin")}
                disabled={submitting}
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an account?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => switchMode("signup")}
                disabled={submitting}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
