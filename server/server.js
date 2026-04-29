const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app");
const port = Number(process.env.PORT || 4173);
const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
const gemmaModel = process.env.GEMMA_MODEL || "gemma4";
const useMock = process.env.USE_MOCK !== "false";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

const mockOutput = {
  sourceSummary:
    "The page introduces plant parts: roots, stem, leaves, flowers, and fruit. It explains what each part does for the plant.",
  teacherLessonPlan: [
    "Objective: Students identify the main parts of a plant and explain one job for each part.",
    "Starter: Ask students to name plants they see near home or school.",
    "Activity: Label the plant diagram, then match each part to its function.",
    "Check: Students explain why roots and leaves are both important.",
  ],
  worksheet: [
    "Label the roots, stem, leaves, flower, and fruit.",
    "Fill in the blank: Roots take in water from the ____.",
    "Circle the part that makes food for the plant.",
    "Write one sentence about why the stem is important.",
  ],
  differentiatedVersions: [
    "Beginner: A plant has roots, a stem, leaves, flowers, and fruit. Each part helps the plant live.",
    "Average: Roots absorb water, the stem carries water, leaves make food, and flowers help make seeds.",
    "Advanced: Plant parts work as a system: roots collect resources, stems transport them, leaves produce energy, and flowers support reproduction.",
  ],
  simplifiedExplanation:
    "Plants are living things. Roots hold the plant and drink water. The stem keeps the plant standing. Leaves help make food. Flowers and fruit help make new plants.",
  localLanguageVersion:
    "Paudhe ke mukhya bhaag jad, tana, pattiyan, phool aur phal hote hain. Har bhaag paudhe ko jeene aur badhne mein madad karta hai.",
  visualDescription:
    "The image shows a simple plant diagram. The roots are at the bottom under the soil. A green stem rises upward. Leaves grow from the stem. A flower is at the top, and a fruit is shown near the side.",
  screenReaderSummary:
    "This lesson is about plant parts and their jobs. The important words are roots, stem, leaves, flower, and fruit. Roots take in water, the stem supports the plant, leaves make food, and flowers help create seeds.",
  audioStudyScript:
    "You are studying the parts of a plant. First, remember the roots. Roots are under the ground and take in water. Next, the stem holds the plant upright and moves water to other parts. Leaves make food using sunlight. Flowers help the plant make seeds. Fruit can protect seeds. A simple way to revise is: roots drink, stems carry, leaves make food, flowers make seeds.",
  studentPractice: [
    "What do roots take from the soil?",
    "Which plant part helps carry water?",
    "Why are leaves important?",
    "Say the five plant parts in order from bottom to top.",
  ],
};

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function normalizeGemmaJson(rawText) {
  const trimmed = rawText.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

function imageDataUrlToBase64(imageDataUrl) {
  const commaIndex = imageDataUrl.indexOf(",");
  return commaIndex >= 0 ? imageDataUrl.slice(commaIndex + 1) : imageDataUrl;
}

function buildPrompt(language) {
  return `You are Classroom Access Kit, an offline inclusive education assistant.

Analyze the classroom image and return only valid JSON with these keys:
sourceSummary, teacherLessonPlan, worksheet, differentiatedVersions, simplifiedExplanation,
localLanguageVersion, visualDescription, screenReaderSummary, audioStudyScript, studentPractice.

Requirements:
- teacherLessonPlan, worksheet, differentiatedVersions, and studentPractice must be arrays of strings.
- localLanguageVersion should be in ${language}.
- visualDescription must help a blind or visually impaired student understand the image.
- audioStudyScript must be clear when spoken aloud.
- Keep the output useful for a low-connectivity classroom.`;
}

async function analyzeWithOllama({ imageDataUrl, language }) {
  const response = await fetch(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: gemmaModel,
      prompt: buildPrompt(language),
      images: imageDataUrl ? [imageDataUrlToBase64(imageDataUrl)] : [],
      stream: false,
      format: "json",
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const payload = await response.json();
  return normalizeGemmaJson(payload.response || "{}");
}

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = path.normalize(path.join(appDir, pathname));
  const relativePath = path.relative(appDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const extension = path.extname(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/analyze") {
    try {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");

      if (useMock) {
        sendJson(response, 200, { mode: "mock", output: mockOutput });
        return;
      }

      const output = await analyzeWithOllama({
        imageDataUrl: payload.imageDataUrl,
        language: payload.language || "Hindi",
      });
      sendJson(response, 200, { mode: "ollama", output });
    } catch (error) {
      sendJson(response, 500, {
        error: "Analysis failed",
        detail: error.message,
        output: mockOutput,
      });
    }
    return;
  }

  if (request.method === "GET") {
    serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(port, () => {
  console.log(`Classroom Access Kit running at http://localhost:${port}`);
  console.log(`Analysis mode: ${useMock ? "mock" : `ollama (${gemmaModel})`}`);
});
