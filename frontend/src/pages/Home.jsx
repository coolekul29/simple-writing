// src/pages/Home.jsx
import React, { useState } from "react";
import "../styles/home.css";
import {
  rewriteTextOnServer,
  simplifyTextOnServer,
} from "../services/textApi";
import {
  countWords,
  limitToMaxWords,
  pasteFromClipboard,
} from "../services/textUtils";
import AlertModal from "../components/AlertModal";

export default function Home({ requireAuthBeforeAction, profile }) {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState(null);

// pull limits from profile if available, fallback to safe defaults
const maxWordsAllowed = profile?.max_words_per_input ?? 100;
const maxDailyRewrites = profile?.rewrite_limit_per_day ?? 10;
const rewritesUsed = profile?.daily_rewrites_used ?? 0;

// are they allowed to rewrite now?
const hasRewriteQuota =
  maxDailyRewrites === -1 || // -1 will represent "unlimited" (tier3)
  rewritesUsed < maxDailyRewrites;

  const MAX_WORDS = 500;
  const MIN_WORDS = 50;

  // typing in textarea
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    const { text: limitedText, count } = limitToMaxWords(
      inputText,
      MAX_WORDS
    );
    setText(limitedText);
    setWordCount(count);
  };

  // Paste button
  const handlePasteClick = async () => {
    try {
      const { text: newText, count } = await pasteFromClipboard(
        text,
        MAX_WORDS
      );
      setText(newText);
      setWordCount(count);
    } catch (err) {
      setAlertData({
        title: "Error encountered",
        message: err.message});
    }
  };

  // --- core worker used by both buttons ---
  const runRewrite = async () => {
    if (!text.trim()) {
      setAlertData({
        title: "Missing Text",
        message: `Please paste or type some text first before rewriting.`,
      });
      return;
    }

    if (wordCount < MIN_WORDS) {
      setAlertData({
        title: "Minimum words required",
        message: `Please enter at least ${MIN_WORDS} words before generating a professional version`
      });
      return;
    }

    // NEW: enforce max words allowed by plan
    if (wordCount > maxWordsAllowed) {
      setAlertData({
        title: "Maximum allowed words",
        message: `Your current plan only supports up to ${maxWordsAllowed} words at a time.\n ` + 
        `Please shorten your text or upgrade your plan.`
      });
      return;
    }

    // NEW: enforce daily rewrite limit
    if (!hasRewriteQuota) {
      setAlertData({
        title: "Daily limit reached",
        message: `You've reached your daily limit of ${maxDailyRewrites} rewrites.\n` + 
        `Upgrade to Pro for unlimited rewrites.`
      });
      return;
    }

    setLoading(true);
    try {
      const rewritten = await rewriteTextOnServer(text);
      setText(rewritten);
      setWordCount(countWords(rewritten));
      // we'll handle incrementing usage later in Step 4
    } catch (err) {
      console.error(err);
      setAlertData({
        title: "Error encountered",
        message: err.message || "Something went wrong."});
      } finally {
      setLoading(false);
    }
  };

  const runSimplify = async () => {
    if (!text.trim()) {
      setAlertData({
        title: "Missing text",
        message: `Please paste or type some text first!`});
      return;
    }

    if (wordCount < MIN_WORDS) {
      setAlertData({
        title: "Minimum words required",
        message: `Please enter at least ${MIN_WORDS} words before simplifying.`
    });
      return;
    }

    if (wordCount > maxWordsAllowed) {
      setAlertData({
        title: "Minimum words required",
        message: `Your current plan only supports up to ${maxWordsAllowed} words at a time.\n` + 
        `Please shorten your text or upgrade your plan.`
    });
      return;
    }

    setLoading(true);
    try {
      const simplified = await simplifyTextOnServer(text);
      setText(simplified);
      setWordCount(countWords(simplified));
    } catch (err) {
      console.error(err);
      setAlertData({
        title: "Eror encountered",
        message: err.message || "Something went wrong."});
    } finally {
      setLoading(false);
    }
  };

  // Button handlers that enforce login first:
  const handleCheckForAI = () => {
    requireAuthBeforeAction(runRewrite);
  };

  const handleSimplifyClick = () => {
    requireAuthBeforeAction(runSimplify);
  };

  const handleTryNowClick = () => {
    // You can decide what Try it Now does.
    // For now let's just also require auth and then focus the textarea.
    requireAuthBeforeAction(() => {
      setAlertData({
        title: "Eror encountered",
        message: "You're in. Start typing or paste your text below 👇"});
      // optional: auto-focus the textarea if you want to get fancy with refs
    });
  };

  // too short warning (<50 words)
  const isTooShort = wordCount > 0 && wordCount < MIN_WORDS;

  return (
    <section className="home">
      <div className="home-inner container">
        {/* Badge */}
        <div className="home-top-text home-div">
          <div className="home-top-text">
            <h4>TRUSTED BY 100,000+ USERS</h4>
          </div>
        </div>

        {/* Main headline */}
        <div className="home-main-text home-div">
          <h1>Simplify your text & make it sound naturally</h1>
        </div>

        {/* Sub text */}
        <div className="home-sub-text home-div">
          <p>
            Simple Writing changes your AI-generated content into a simple
            and easy to understand writing, making sure it passes any AI
            detection tool
          </p>
        </div>

        {/* CTA button */}
        <div className="home-try-button home-div">
          <button onClick={handleTryNowClick}>Try it Now!</button>
        </div>

        {/* "No credit card needed" */}
        <div className="home-bottom-text home-div">
          <p>No credit card needed</p>
        </div>

        {/* Editor block */}
        <div className="home-card">
          {/* header row */}
          <div className="home-card-header">
            <span>Your Text</span>
            <div className="home-card-mode">
              <i className="fa-solid fa-wand-sparkles"></i>
            </div>
          </div>

          {/* textarea area */}
          <div className="home-card-body">
            <textarea
              className="text-input"
              placeholder="Paste your text here..."
              value={text}
              onChange={handleTextChange}
            ></textarea>

            <button className="paste-btn" onClick={handlePasteClick}>
              <i className="fa-regular fa-clipboard"></i>
              <span>Paste Text</span>
            </button>
          </div>

          {/* footer row under textarea */}
          <div className="home-card-footer">
            <div className={`word-section ${isTooShort ? "error" : ""}`}>
            <span className="word-count">
              {wordCount} / {maxWordsAllowed} words
            </span>

              {isTooShort && (
                <span className="min-warning">
                  Minimum {MIN_WORDS} words required
                </span>
              )}
            </div>

            <div className="footer-actions">
              <button
                className="check-btn"
                onClick={handleCheckForAI}
                disabled={loading}
              >
                {loading ? "Working..." : "AI-Generated"}
              </button>

              <button
                className="simplify-btn"
                onClick={handleSimplifyClick}
                disabled={loading}
              >
                {loading ? "Working..." : "Simplify"}
              </button>
            </div>
          </div>
        </div>
      </div>
    {alertData && (
      <AlertModal
        title={alertData.title}
        message={alertData.message}
        actions={alertData.actions}
        onClose={() => setAlertData(null)}
      />
    )}
    </section>
  );
}