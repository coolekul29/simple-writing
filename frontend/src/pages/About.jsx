import React from "react";
import "../styles/about.css";

export default function About() {
  return (
    <section className="about-page container">
      {/* Header Section */}
      <div className="about-hero">
        <h1>About Simple Writing</h1>
        <p className="about-tagline">
          We help you say what you mean — clearly, naturally, and confidently.
        </p>
      </div>

      {/* Two-column story / mission */}
      <div className="about-content">
        <div className="about-card">
          <h2>What Simple Writing Does</h2>
          <p>
            Simple Writing turns rough or AI-generated text into something that
            sounds natural, clear, and human. You paste your text, choose how
            you want it to sound, and we instantly rewrite it for you.
          </p>
          <p>
            Our goal is not just to “fix grammar.” We help you talk like a real
            person — or like a professional — without losing your meaning.
          </p>
        </div>

        <div className="about-card">
          <h2>Why We Built This</h2>
          <p>
            A lot of AI writing sounds stiff, robotic, or overly formal. It’s
            easy to tell when something was written by a model.
          </p>
          <p>
            Simple Writing was created to solve that. We take AI-looking text
            and make it feel like it was written by you — clear, confident, and
            human. We also help you go the other direction: turn casual drafts
            into professional, polished language when you need to sound more
            formal.
          </p>
        </div>
      </div>

      {/* Features / Capabilities */}
      <div className="about-grid">
        <div className="about-feature">
          <h3>📄 Rewrite in Seconds</h3>
          <p>
            Paste your text and let the app rewrite it instantly. No account or
            credit card required to start.
          </p>
        </div>

        <div className="about-feature">
          <h3>🧠 Professional Tone</h3>
          <p>
            Need to sound polished, respectful, and formal? Use the
            “AI-Generated” mode to get a professional rewrite you could send to
            a boss, professor, or client.
          </p>
        </div>

        <div className="about-feature">
          <h3>💬 Human Tone</h3>
          <p>
            Want something more natural and easy to read? “Simplify” rewrites
            your text in plain language — more like how a real person would
            explain it to a smart friend.
          </p>
        </div>

        <div className="about-feature">
          <h3>🔒 You’re in Control</h3>
          <p>
            You decide what to paste. We just rewrite and send it back. The text
            you see in the box is the text you control.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="about-how-card">
        <h2>How It Works</h2>
        <ol className="about-steps">
          <li>
            <strong>Paste your text</strong> — or click “Paste Text” to grab
            from your clipboard.
          </li>
          <li>
            <strong>Pick a style</strong> — professional (AI-Generated) or
            friendly (Simplify).
          </li>
          <li>
            <strong>Get your rewrite</strong> — instantly, in the same box.
          </li>
        </ol>
        <p className="about-hint">
          You can edit the result, run it again, and fine-tune the tone until it
          feels right.
        </p>
      </div>

      {/* Small credibility / safety note */}
      <div className="about-footnote">
        <p>
          Simple Writing is an educational tool. It’s designed to help you
          improve clarity, tone, and confidence in your writing — not to do
          anything harmful or misleading. Please use it responsibly.
        </p>
      </div>
    </section>
  );
}
