import "dotenv/config";
import express from "express";
import fs from "node:fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_TRANSCRIBE_MODEL = "whisper-large-v3-turbo";
const GROQ_TRANSCRIBE_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});
const DEFAULT_COACHING_STYLE = "The Caddy";
const SYSTEM_PROMPT_PATH = path.join(__dirname, "whisper-system-prompt.md");

function loadWhisperSystemPrompt() {
  const markdown = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
  const match = markdown.match(/## Full System Prompt\s+```([\s\S]*?)```/m);
  if (!match?.[1]) {
    throw new Error(
      "Unable to load Whisper system prompt block from whisper-system-prompt.md.",
    );
  }
  return match[1].trim();
}

const WHISPER_SYSTEM_PROMPT_TEMPLATE = loadWhisperSystemPrompt();

function buildSystemPrompt(coachingStyle) {
  return WHISPER_SYSTEM_PROMPT_TEMPLATE.replaceAll(
    "{{COACHING_STYLE}}",
    coachingStyle,
  );
}

function buildAnthropicPayload(prompt, coachingStyle) {
  return {
    system: buildSystemPrompt(coachingStyle),
    model: ANTHROPIC_MODEL,
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  };
}

app.use(express.json());

app.post("/api/ask", async (req, res) => {
  const { prompt, coachingStyle } = req.body ?? {};
  const resolvedCoachingStyle =
    typeof coachingStyle === "string" && coachingStyle.trim()
      ? coachingStyle.trim()
      : DEFAULT_COACHING_STYLE;
  const requestStartedAt = new Date().toISOString();
  const promptPreview =
    typeof prompt === "string" ? `${prompt.slice(0, 120)}${prompt.length > 120 ? "..." : ""}` : "";

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing required string field: prompt" });
  }

  if (!ANTHROPIC_API_KEY) {
    console.error(
      `[${requestStartedAt}] /api/ask configuration error: missing ANTHROPIC_API_KEY`,
    );
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY." });
  }

  try {
    console.log(
      `[${requestStartedAt}] /api/ask -> Anthropic model=${ANTHROPIC_MODEL} style="${resolvedCoachingStyle}" prompt="${promptPreview}"`,
    );
    const anthropicPayload = buildAnthropicPayload(prompt, resolvedCoachingStyle);
    if (!anthropicPayload.system) {
      throw new Error("System prompt is empty and cannot be sent to Anthropic.");
    }
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicPayload),
    });

    if (!apiRes.ok) {
      const bodyText = await apiRes.text();
      console.error(
        `[${requestStartedAt}] Anthropic non-2xx status=${apiRes.status} body=${bodyText}`,
      );
      return res.status(apiRes.status).json({
        error: `Anthropic API error (${apiRes.status})`,
        details: bodyText,
      });
    }

    const data = await apiRes.json();
    const text = Array.isArray(data.content)
      ? data.content
          .filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n")
          .trim()
      : "";

    console.log(
      `[${requestStartedAt}] /api/ask success responseChars=${(text || "").length}`,
    );
    return res.json({ response: text || "No response text received." });
  } catch (error) {
    console.error(`[${requestStartedAt}] Anthropic request threw:`, error);
    return res.status(500).json({
      error: "Failed to reach Anthropic API.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  const requestStartedAt = new Date().toISOString();

  if (!req.file?.buffer?.length) {
    return res.status(400).json({ error: "Missing audio file (multipart field: file)." });
  }

  if (!GROQ_API_KEY) {
    console.error(`[${requestStartedAt}] /api/transcribe: missing GROQ_API_KEY`);
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY." });
  }

  try {
    const originalname = req.file.originalname || "recording.webm";
    const formData = new FormData();
    formData.append("model", GROQ_TRANSCRIBE_MODEL);
    formData.append(
      "file",
      new Blob([req.file.buffer], {
        type: req.file.mimetype || "application/octet-stream",
      }),
      originalname,
    );

    const groqRes = await fetch(GROQ_TRANSCRIBE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: formData,
    });

    const bodyText = await groqRes.text();

    if (!groqRes.ok) {
      console.error(
        `[${requestStartedAt}] Groq transcribe non-2xx status=${groqRes.status} body=${bodyText}`,
      );
      return res.status(groqRes.status).json({
        error: `Groq API error (${groqRes.status})`,
        details: bodyText,
      });
    }

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      return res.status(500).json({
        error: "Invalid response from Groq API.",
        details: bodyText.slice(0, 500),
      });
    }

    const text = typeof data.text === "string" ? data.text.trim() : "";

    console.log(
      `[${requestStartedAt}] /api/transcribe success transcriptChars=${text.length}`,
    );
    return res.json({ transcript: text });
  } catch (error) {
    console.error(`[${requestStartedAt}] /api/transcribe threw:`, error);
    return res.status(500).json({
      error: "Failed to reach Groq API.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

const systemPreview = WHISPER_SYSTEM_PROMPT_TEMPLATE.slice(0, 100);
console.log(`Loaded system prompt (first 100 chars): ${systemPreview}`);
console.log(`Default coaching style: ${DEFAULT_COACHING_STYLE}`);


app.use(express.static(path.join(__dirname, "dist")));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, () => {
  // Minimal startup log for local development.
  console.log(`rangeWhisperer API listening on http://localhost:${PORT}`);
});

server.on("error", (error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
