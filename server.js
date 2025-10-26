const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// pull key from .env
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// health check (optional)
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// rewrite endpoint
app.post("/api/rewrite", async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Simple Writing Dev",
      },
      body: JSON.stringify({
        model: "minimax/minimax-m2:free",
        messages: [
          {
            role: "user",
            content:
            `Rewrite the following text so it sounds highly professional, polished, and formal, while preserving the original meaning.

            Rules:
            - ONLY return the rewritten text.
            - Do NOT add any explanation, summary, analysis, commentary, or metadata.
            - Do NOT include any labels like "Rewritten:" or "Here's your text:".
            - Do NOT include <think> blocks or reasoning steps of any kind.

            Text to rewrite:
            """${text}"""`,
          },
        ],
        temperature: 0.5,
      }),
    });

    const data = await openrouterRes.json();

    console.log("OpenRouter status:", openrouterRes.status);
    console.log("OpenRouter response data:", data);

    if (!openrouterRes.ok) {
      return res
        .status(500)
        .json({ error: data.error?.message || "OpenRouter request failed" });
    }

    // Grab the model's answer
    let aiVersion = data.choices?.[0]?.message?.content || "";

    // --- sanitize output ---

    // 1. If the model gave us a "<think> ... </think> actual output", extract only the part after </think>
    const thinkCloseIndex = aiVersion.indexOf("</think>");
    if (thinkCloseIndex !== -1) {
      aiVersion = aiVersion.slice(thinkCloseIndex + "</think>".length).trim();
    }

    // 2. Remove any leftover <think>...</think> blocks just in case
    aiVersion = aiVersion.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    // 3. Remove things like "Clarifications:" or bullet lists if it ignored instructions
    //    We'll do a light heuristic: if it starts with something like "Thank you for sharing", that's commentary.
    //    BUT we won't get too aggressive right now. We mainly care about trimming that reasoning blob.

    return res.json({ rewritten: aiVersion });
  } catch (err) {
    console.error("Server error calling OpenRouter:", err);
    return res.status(500).json({ error: "Server crashed calling OpenRouter" });
  }
});

app.post("/api/simplify", async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const openrouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Simple Writing Dev",
      },
      body: JSON.stringify({
        model: "minimax/minimax-m2:free",
        messages: [
          {
            role: "user",
            content:
            `Rewrite the following text so it is extremely clear, simple, casual, and human — like you're explaining it to a smart friend. 
            Make it friendly and easy to understand. Remove formal/corporate tone, remove jargon, but keep the original meaning.

            Rules:
            - ONLY return the rewritten text.
            - Do NOT add explanation, notes, analysis, or bullet points.
            - Do NOT include <think> or reasoning steps of any kind.

            Text to rewrite:
            """${text}"""`,
          },
        ],
        temperature: 0.6,
      }),
    });

    const data = await openrouterRes.json();

    console.log("OpenRouter status (simplify):", openrouterRes.status);
    console.log("OpenRouter response data (simplify):", data);

    if (!openrouterRes.ok) {
      return res
        .status(500)
        .json({ error: data.error?.message || "OpenRouter request failed" });
    }

    // extract result
    let aiVersion = data.choices?.[0]?.message?.content || "";

    // strip <think> if model leaked it
    const thinkCloseIndex = aiVersion.indexOf("</think>");
    if (thinkCloseIndex !== -1) {
      aiVersion = aiVersion.slice(thinkCloseIndex + "</think>".length).trim();
    }
    aiVersion = aiVersion.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    return res.json({ rewritten: aiVersion });
  } catch (err) {
    console.error("Server error calling OpenRouter (simplify):", err);
    return res
      .status(500)
      .json({ error: "Server crashed calling OpenRouter (simplify)" });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, topic, message } = req.body;

  // basic validation on server
  if (
    !name ||
    !name.trim() ||
    !email ||
    !email.trim() ||
    !message ||
    !message.trim()
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // build the email body
    const textBody = `
New contact form submission from Simple Writing:

Name: ${name}
Email: ${email}
Topic: ${topic || "(not specified)"}

Message:
${message}
    `.trim();

    // send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Simple Writing <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL],
        subject: `New message from ${name} (${topic || 'general'})`,
        text: textBody
      })
    });

    const data = await resendRes.json();
    console.log("Resend status:", resendRes.status, data);

    if (!resendRes.ok) {
      return res
        .status(500)
        .json({ error: data.error?.message || "Failed to send email." });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Server error sending contact email:", err);
    return res
      .status(500)
      .json({ error: "Server crashed trying to send email." });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
});
