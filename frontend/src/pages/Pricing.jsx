// src/pages/Pricing.jsx
import React from "react";
import "../styles/pricing.css";

export default function Pricing() {
  return (
    <section className="pricing">
      <div className="pricing-inner container">
        <h1 className="pricing-title">Choose your plan</h1>
        <p className="pricing-sub">
          Start free. Upgrade only if you need more.
        </p>

        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="price-card">
            <h2>Free</h2>
            <p className="price-amount">$0</p>
            <p className="price-desc">Great for testing Simple Writing</p>
            <ul className="price-features">
              <li>✔ 5 rewrites / day</li>
              <li>✔ AI-to-human simplifier</li>
              <li>✔ Tone: Casual human</li>
              <li>✖ Priority support</li>
            </ul>
            <button className="price-btn">Get Started</button>
          </div>

          {/* $5 Plan */}
          <div className="price-card featured">
            <div className="badge-popular">Most Popular</div>
            <h2>Starter</h2>
            <p className="price-amount">$5</p>
            <p className="price-desc">For students & job seekers</p>
            <ul className="price-features">
              <li>✔ 100 rewrites / day</li>
              <li>✔ AI-to-human + Professional tone</li>
              <li>✔ Grammar cleanup</li>
              <li>✔ Email / cover letter friendly</li>
              <li>✖ Priority support</li>
            </ul>
            <button className="price-btn primary">Choose Starter</button>
          </div>

          {/* $10 Plan */}
          <div className="price-card">
            <h2>Pro</h2>
            <p className="price-amount">$10</p>
            <p className="price-desc">For business / content creators</p>
            <ul className="price-features">
              <li>✔ Unlimited rewrites</li>
              <li>✔ All tone options (casual, professional, academic)</li>
              <li>✔ Priority support</li>
              <li>✔ Early access to new features</li>
            </ul>
            <button className="price-btn">Go Pro</button>
          </div>
        </div>

        <p className="pricing-hint">
          No credit card required to try. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
