import React, { useState } from "react";
import "../styles/contactus.css";
import API_BASE from "../config"; // adjust path if needed

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // front-end required validation
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill out Name, Email, and Message.");
      setSubmitted(false);
      return;
    }

    setSending(true);
    setErrorMsg("");
    setSubmitted(false);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          topic,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Contact error:", data);
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setSending(false);
        return;
      }

      // success!
      setSubmitted(true);
      setSending(false);

      // clear form
      setName("");
      setEmail("");
      setTopic("general");
      setMessage("");
    } catch (err) {
      console.error("Network error:", err);
      setErrorMsg("Unable to send right now. Please try again later.");
      setSending(false);
    }
  };

  return (
    <section className="contact-page container">
      <div className="contact-hero">
        <h1>Contact Us</h1>
        <p className="contact-tagline">
          Questions, feedback, feature requests — we’d love to hear from you.
        </p>
      </div>

      <div className="contact-layout">
        {/* LEFT SIDE INFO */}
        <div className="contact-info-card">
          <h2>How can we help?</h2>
          <p>
            Simple Writing is still evolving. If something didn’t work, or you
            have an idea that would make rewriting better, please let us know.
          </p>

          <div className="contact-list">
            <div className="contact-item">
              <span className="contact-label">Product support</span>
              <span className="contact-desc">
                Trouble using “AI-Generated” or “Simplify”? Tell us what
                happened.
              </span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Feature request</span>
              <span className="contact-desc">
                Need a new tone (email-friendly, academic, résumé, etc.)?
              </span>
            </div>

            <div className="contact-item">
              <span className="contact-label">Report an issue</span>
              <span className="contact-desc">
                Paste the original text, and the rewrite you got, so we can
                improve quality.
              </span>
            </div>
          </div>

          <div className="contact-hint">
            <p>
              We read every message. This tool is here to help people write
              confidently — not to replace their voice.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="contact-form-card">
          <h2>Send us a message</h2>

          {submitted && (
            <div className="contact-success">
              <span>✓</span>
              <p>Thanks! Your message has been sent.</p>
            </div>
          )}

          {errorMsg && !submitted && (
            <div className="contact-error">
              <span>!</span>
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <label>
                Your Name <span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="general">General question</option>
                <option value="support">Something isn't working</option>
                <option value="feature">Feature request</option>
                <option value="feedback">Feedback / suggestion</option>
              </select>
            </div>

            <div className="form-row">
              <label>
                Message <span className="required">*</span>
              </label>
              <textarea
                placeholder="Tell us what's going on..."
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <div className="contact-bottom-note">
        <p>
          Simple Writing is an educational tool. Please don’t use it to
          generate harmful, misleading, or abusive content. We may use
          anonymized feedback to improve rewrite quality.
        </p>
      </div>
    </section>
  );
}
