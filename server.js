const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

app.post("/analyzeText", async (req, res) => {
  try {
    const text = req.body.text;

    if (!text || text.trim().length < 10) {
      return res.json({ error: "Invalid OCR text" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `
You are a strict study assistant.

Analyze only the given text.

Tasks:
1. Extract 8–12 keywords
2. Generate summary (3–5 lines)
3. Detect subject
4. Identify headings

Text:
${text}

Return JSON:
{
  "subject": "",
  "keywords": [],
  "summary": "",
  "headings": []
}
`,
          },
        ],
      }),
    });

    const data = await response.json();

    res.json({
      result: data.choices?.[0]?.message?.content || "",
    });

  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("LexiScan AI Backend Running 🚀");
});

app.listen(3000, () => console.log("Server running"));
