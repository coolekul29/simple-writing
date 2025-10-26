import React, { useState } from "react";
import "../styles/home.css";
import { rewriteTextOnServer, simplifyTextOnServer,} from "../services/textApi";
import { countWords, limitToMaxWords, pasteFromClipboard,} from "../services/textUtils";

export default function Home() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const MAX_WORDS = 500;
  const MIN_WORDS = 50;

  // Handle typing in textarea
  const handleTextChange = (e) => {
    const inputText = e.target.value;
    const { text: limitedText, count } = limitToMaxWords(inputText, MAX_WORDS);
    setText(limitedText);
    setWordCount(count);
  };

  // Paste button
  const handlePasteClick = async () => {
    try {
      const { text: newText, count } = await pasteFromClipboard(text, MAX_WORDS);
      setText(newText);
      setWordCount(count);
    } catch (err) {
      alert(err.message);
    }
  };

  // AI-Generated (professional tone)
  const handleCheckForAI = async () => {
    if (!text.trim()) {
      alert("Please paste or type some text first!");
      return;
    }
    if (wordCount < MIN_WORDS) {
      alert(`Please enter at least ${MIN_WORDS} words before generating a professional version.`);
      return;
    }

    setLoading(true);
    try {
      const rewritten = await rewriteTextOnServer(text);
      setText(rewritten);
      setWordCount(countWords(rewritten));
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Simplify (casual human tone)
  const handleSimplify = async () => {
    if (!text.trim()) {
      alert("Please paste or type some text first!");
      return;
    }
    if (wordCount < MIN_WORDS) {
      alert(`Please enter at least ${MIN_WORDS} words before simplifying.`);
      return;
    }

    setLoading(true);
    try {
      const simplified = await simplifyTextOnServer(text);
      setText(simplified);
      setWordCount(countWords(simplified));
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
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
          <h1>Simplify your text & make it naturally sound</h1>
        </div>

        {/* Sub text */}
        <div className="home-sub-text home-div">
          <p>
            Simple Writing changes your AI-generated content into a simple and easy to
            understand writing, making sure it passes any AI detection tool
          </p>
        </div>

        {/* CTA button */}
        <div className="home-try-button home-div">
          <button>Try it Now!</button>
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
                <span>Default</span>
                <i className="fa-solid fa-chevron-down"></i>
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
                  {wordCount} / {MAX_WORDS} words
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
                  onClick={handleSimplify}
                  disabled={loading}
                >
                  {loading ? "Working..." : "Simplify"}
                </button>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
