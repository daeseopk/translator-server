const express = require("express");
const app = express();
const cors = require("cors");
const { default: OpenAI } = require("openai");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Open Translator Server is running!");
});
const port = process.env.PORT || 8080;

// 번역 요청 처리 엔드포인트
app.post("/translate", async (req, res) => {
  const { apiKey, prompt } = req.body;
  console.log("request accepted from ", req.ip);
  if (!apiKey || !prompt) {
    return res
      .status(400)
      .json({ error: "apiKey, prompt, targetLang are required" });
  }
  try {
    const client = new OpenAI({
      apiKey: apiKey,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({ message: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
