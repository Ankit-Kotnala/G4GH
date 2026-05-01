const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const appDir = path.join(root, "app");

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(appDir, ".env"));

const port = Number(process.env.PORT || 4173);
const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
const geminiApiUrl =
  process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta";
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
const geminiModel = normalizeGemmaModel(
  process.env.GEMINI_MODEL || process.env.GEMMA_MODEL || "gemma-4-26b-a4b-it",
);
const ollamaModel = process.env.OLLAMA_MODEL || process.env.GEMMA_MODEL || "gemma4";
const runtimeMode = resolveRuntimeMode();

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const schemaKeys = [
  "sourceSummary",
  "contentSignals",
  "teacherLessonPlan",
  "classroomActivity",
  "worksheet",
  "differentiatedVersions",
  "assessmentRubric",
  "simplifiedExplanation",
  "localLanguageVersion",
  "visualDescription",
  "screenReaderSummary",
  "audioStudyScript",
  "studentPractice",
  "keyVocabulary",
  "confidenceNotes",
];

const languagePacks = {
  Hindi:
    "Paudhe ke mukhya bhaag jad, tana, pattiyan, phool aur phal hote hain. Jad pani leti hain, tana paudhe ko sambhalta hai, pattiyan bhojan banati hain, aur phool beej banane mein madad karte hain.",
  Spanish:
    "Las partes principales de una planta son raices, tallo, hojas, flores y fruto. Las raices toman agua, el tallo sostiene la planta, las hojas hacen alimento y las flores ayudan a formar semillas.",
  Swahili:
    "Sehemu kuu za mmea ni mizizi, shina, majani, maua na tunda. Mizizi huchukua maji, shina hushikilia mmea, majani hutengeneza chakula, na maua husaidia kutengeneza mbegu.",
  Bengali:
    "Gacher prodhan angsho holo jar, kand, pata, phool ebong phol. Jar jol ney, kand gachke dhore rakhe, pata khabar toyri kore, ar phool beej toyri korte shahajyo kore.",
  English:
    "The main parts of a plant are roots, stem, leaves, flowers, and fruit. Roots take in water, the stem supports the plant, leaves make food, and flowers help make seeds.",
};

function normalizeGemmaModel(modelName) {
  const value = String(modelName || "").trim();
  const shortcuts = new Set(["gemma4", "gemma-4", "gemma_4", "gemma"]);

  if (!value || shortcuts.has(value.toLowerCase())) {
    return "gemma-4-26b-a4b-it";
  }

  return value;
}

function resolveRuntimeMode() {
  const explicitMode = String(process.env.AI_RUNTIME || process.env.RUNTIME || "").toLowerCase();

  if (["gemini", "ollama", "mock"].includes(explicitMode)) {
    return explicitMode;
  }

  if (process.env.USE_MOCK === "true") {
    return "mock";
  }

  if (process.env.USE_MOCK === "false") {
    return geminiApiKey ? "gemini" : "ollama";
  }

  return geminiApiKey ? "gemini" : "mock";
}

function activeModelName() {
  return runtimeMode === "ollama" ? ollamaModel : geminiModel;
}

function geminiModelCandidates() {
  return [...new Set([geminiModel, "gemma-4-26b-a4b-it", "gemma-4-31b-it"])];
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    if (!process.env[key.trim()]) {
      process.env[key.trim()] = value;
    }
  });
}

function createDemoOutput(settings = {}) {
  const language = settings.language || "Hindi";
  const profile = settings.profile || "Blind or low-vision student";
  const focus = settings.focus || "Concept clarity and revision";
  const note = settings.teacherNote ? ` Teacher note considered: ${settings.teacherNote}` : "";

  return {
    sourceSummary:
      "The classroom page explains the main parts of a plant: roots, stem, leaves, flowers, and fruit. It connects each part to a job that helps the plant live and grow.",
    contentSignals: [
      "Textbook-style science page",
      "Plant diagram with labels",
      "Five key vocabulary terms",
      `${language} support requested`,
      `${profile} accessibility path`,
    ],
    teacherLessonPlan: [
      "Objective: Students identify roots, stem, leaves, flower, and fruit, then explain one job for each part.",
      "Starter: Ask students to name plants near home or school and describe what they can see.",
      "Mini lesson: Use the diagram from bottom to top so students connect position with function.",
      "Guided practice: Students label the diagram and match each plant part to its job.",
      "Exit check: Students explain why roots and leaves are both essential for the plant.",
    ],
    classroomActivity: [
      "Pair students: one describes a plant part, the other names it.",
      "Use real leaves or a local plant if available, then compare it with the page.",
      "Ask students to build a spoken plant map from roots upward for classmates who cannot see the diagram.",
    ],
    worksheet: [
      "Label the roots, stem, leaves, flower, and fruit.",
      "Fill in the blank: Roots take in water from the ____.",
      "Circle the part that makes food for the plant.",
      "Match: stem -> carries water, flower -> helps make seeds, fruit -> protects seeds.",
      "Write one sentence explaining how two plant parts work together.",
    ],
    differentiatedVersions: [
      "Beginner: A plant has roots, a stem, leaves, flowers, and fruit. Each part helps the plant live.",
      "Core: Roots absorb water, the stem carries water, leaves make food, and flowers help make seeds.",
      "Advanced: Plant parts work as a system: roots gather resources, stems transport them, leaves produce energy, and flowers support reproduction.",
    ],
    assessmentRubric: [
      "Secure: Correctly names all five parts and explains at least three functions.",
      "Developing: Names most parts and explains one or two functions with support.",
      "Needs support: Can point to or repeat plant parts but needs guided explanation of function.",
    ],
    simplifiedExplanation:
      "Plants are living things. Roots hold the plant and drink water. The stem keeps the plant standing and moves water. Leaves help make food. Flowers and fruit help make new plants.",
    localLanguageVersion: languagePacks[language] || languagePacks.English,
    visualDescription:
      "The page shows a simple plant diagram. Start at the bottom: roots spread under the soil. A single green stem rises upward. Leaves grow out from the sides of the stem. At the top is a flower, and a fruit is shown near one side. The layout helps students remember the plant from bottom to top.",
    screenReaderSummary:
      "This lesson is about plant parts and their jobs. The important words are roots, stem, leaves, flower, and fruit. Roots take in water, the stem supports and carries water, leaves make food, flowers help create seeds, and fruit can protect seeds.",
    audioStudyScript:
      "You are studying the parts of a plant. First, remember the roots. Roots are usually under the ground and take in water. Next, the stem holds the plant upright and carries water to other parts. Leaves make food using sunlight. Flowers help the plant make seeds. Fruit can protect seeds. A simple revision line is: roots drink, stems carry, leaves make food, flowers make seeds.",
    studentPractice: [
      {
        question: "What do roots take from the soil?",
        hint: "Think about what plants need to drink.",
        answer: "Roots take in water from the soil.",
      },
      {
        question: "Which plant part helps carry water upward?",
        hint: "It stands in the middle and holds the plant up.",
        answer: "The stem carries water upward.",
      },
      {
        question: "Why are leaves important?",
        hint: "Leaves use sunlight.",
        answer: "Leaves help the plant make food.",
      },
      {
        question: "Say the five plant parts from bottom to top.",
        hint: "Start underground.",
        answer: "Roots, stem, leaves, flower, and fruit.",
      },
    ],
    keyVocabulary: [
      "Roots: hold the plant and take in water.",
      "Stem: supports the plant and carries water.",
      "Leaves: make food using sunlight.",
      "Flower: helps the plant make seeds.",
      "Fruit: protects seeds in many plants.",
    ],
    confidenceNotes: [
      "Output is optimized for the sample plant page and hackathon demonstration.",
      `Teaching focus: ${focus}.${note}`,
      "For real classroom photos, upload a clear JPEG or PNG so the local vision model can inspect the image.",
    ],
  };
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 18_000_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function normalizeGemmaJson(rawText) {
  const trimmed = String(rawText || "").trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(jsonText);
}

function imageDataUrlToBase64(imageDataUrl) {
  const commaIndex = imageDataUrl.indexOf(",");
  return commaIndex >= 0 ? imageDataUrl.slice(commaIndex + 1) : imageDataUrl;
}

function arrayOfStrings(value, fallback) {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") return item.question || item.text || JSON.stringify(item);
        return String(item || "");
      })
      .filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return fallback;
}

function practiceArray(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  return value
    .map((item) => {
      if (typeof item === "string") {
        return { question: item, hint: "", answer: "" };
      }
      return {
        question: item?.question || item?.prompt || "",
        hint: item?.hint || "",
        answer: item?.answer || "",
      };
    })
    .filter((item) => item.question);
}

function validateOutput(output, settings) {
  const fallback = createDemoOutput(settings);
  const normalized = {
    sourceSummary:
      typeof output?.sourceSummary === "string" && output.sourceSummary.trim()
        ? output.sourceSummary.trim()
        : fallback.sourceSummary,
    contentSignals: arrayOfStrings(output?.contentSignals, fallback.contentSignals),
    teacherLessonPlan: arrayOfStrings(output?.teacherLessonPlan, fallback.teacherLessonPlan),
    classroomActivity: arrayOfStrings(output?.classroomActivity, fallback.classroomActivity),
    worksheet: arrayOfStrings(output?.worksheet, fallback.worksheet),
    differentiatedVersions: arrayOfStrings(
      output?.differentiatedVersions,
      fallback.differentiatedVersions,
    ),
    assessmentRubric: arrayOfStrings(output?.assessmentRubric, fallback.assessmentRubric),
    simplifiedExplanation:
      typeof output?.simplifiedExplanation === "string" && output.simplifiedExplanation.trim()
        ? output.simplifiedExplanation.trim()
        : fallback.simplifiedExplanation,
    localLanguageVersion:
      typeof output?.localLanguageVersion === "string" && output.localLanguageVersion.trim()
        ? output.localLanguageVersion.trim()
        : fallback.localLanguageVersion,
    visualDescription:
      typeof output?.visualDescription === "string" && output.visualDescription.trim()
        ? output.visualDescription.trim()
        : fallback.visualDescription,
    screenReaderSummary:
      typeof output?.screenReaderSummary === "string" && output.screenReaderSummary.trim()
        ? output.screenReaderSummary.trim()
        : fallback.screenReaderSummary,
    audioStudyScript:
      typeof output?.audioStudyScript === "string" && output.audioStudyScript.trim()
        ? output.audioStudyScript.trim()
        : fallback.audioStudyScript,
    studentPractice: practiceArray(output?.studentPractice, fallback.studentPractice),
    keyVocabulary: arrayOfStrings(output?.keyVocabulary, fallback.keyVocabulary),
    confidenceNotes: arrayOfStrings(output?.confidenceNotes, fallback.confidenceNotes),
  };

  return normalized;
}

function buildPrompt(settings) {
  const language = settings.language || "Hindi";
  const gradeBand = settings.gradeBand || "Primary school";
  const profile = settings.profile || "Blind or low-vision student";
  const focus = settings.focus || "Concept clarity and revision";
  const teacherNote = settings.teacherNote || "No extra note provided.";

  return `You are Classroom Access Kit, a local-first inclusive education assistant powered by Gemma 4.

Analyze the classroom image and create a complete classroom support pack.

Context:
- Grade band: ${gradeBand}
- Learner profile: ${profile}
- Teaching focus: ${focus}
- Local language requested: ${language}
- Teacher note: ${teacherNote}

Return only valid JSON. Do not use markdown. Use this exact schema:
{
  "sourceSummary": "string",
  "contentSignals": ["string"],
  "teacherLessonPlan": ["string"],
  "classroomActivity": ["string"],
  "worksheet": ["string"],
  "differentiatedVersions": ["string"],
  "assessmentRubric": ["string"],
  "simplifiedExplanation": "string",
  "localLanguageVersion": "string",
  "visualDescription": "string",
  "screenReaderSummary": "string",
  "audioStudyScript": "string",
  "studentPractice": [{"question": "string", "hint": "string", "answer": "string"}],
  "keyVocabulary": ["string"],
  "confidenceNotes": ["string"]
}

Quality requirements:
- Make outputs practical for a teacher in a low-connectivity classroom.
- Make Student Study Mode useful for blind or low-vision learners.
- visualDescription must move from overview to spatial details.
- screenReaderSummary must avoid visually dependent wording.
- audioStudyScript must sound natural when read aloud.
- worksheet must be printable and answerable without internet.
- localLanguageVersion must be in ${language}.
- Keep text concise and classroom-ready.`;
}

async function fetchWithTimeout(url, options, timeoutMs = 55_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function parseImageDataUrl(imageDataUrl) {
  const match = String(imageDataUrl || "").match(/^data:([^;]+);base64,(.*)$/i);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1] || "image/jpeg",
    data: match[2] || "",
  };
}

function extractGeminiText(payload) {
  return (payload?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("\n")
    .trim();
}

async function generateWithGemini({ prompt, imageDataUrl = "", responseMimeType = "" }) {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const image = parseImageDataUrl(imageDataUrl);
  const parts = [];

  if (image?.data) {
    parts.push({
      inline_data: {
        mime_type: image.mimeType,
        data: image.data,
      },
    });
  }

  parts.push({ text: prompt });

  const generationConfig = {
    temperature: 0.2,
    topP: 0.85,
    thinkingConfig: {
      thinkingLevel: "high",
    },
  };

  if (responseMimeType) {
    generationConfig.responseMimeType = responseMimeType;
  }

  let lastError;

  for (const model of geminiModelCandidates()) {
    try {
      const response = await fetchWithTimeout(`${geminiApiUrl}/models/${model}:generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          generationConfig,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(`Gemini API returned ${response.status}: ${details.slice(0, 220)}`);
      }

      const payload = await response.json();
      const text = extractGeminiText(payload);

      if (!text) {
        throw new Error("Gemini API returned an empty response");
      }

      return { text, model };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini API request failed");
}

async function analyzeWithOllama({ imageDataUrl, settings }) {
  const body = {
    model: ollamaModel,
    prompt: buildPrompt(settings),
    images: imageDataUrl ? [imageDataUrlToBase64(imageDataUrl)] : [],
    stream: false,
    format: "json",
    options: {
      temperature: 0.2,
      top_p: 0.85,
    },
  };

  const response = await fetchWithTimeout(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const payload = await response.json();
  return validateOutput(normalizeGemmaJson(payload.response || "{}"), settings);
}

async function analyzeWithGemini({ imageDataUrl, settings }) {
  const result = await generateWithGemini({
    prompt: buildPrompt(settings),
    imageDataUrl,
    responseMimeType: "application/json",
  });

  return {
    model: result.model,
    output: validateOutput(normalizeGemmaJson(result.text || "{}"), settings),
  };
}

function buildAskPrompt({ question, output, settings }) {
  return `You are Classroom Access Kit using Gemma 4 for local study support.

Answer the student's follow-up question using only the lesson pack below. Keep the answer short, accessible, and friendly for ${settings.profile}.

Question: ${question}

Lesson pack:
${JSON.stringify(output).slice(0, 8000)}

Return plain text only.`;
}

function mockAnswer(question) {
  const lower = String(question || "").toLowerCase();
  if (lower.includes("root")) {
    return "Roots are important because they hold the plant in the soil and take in water. A simple memory line is: roots drink.";
  }
  if (lower.includes("leaf") || lower.includes("leaves")) {
    return "Leaves help the plant make food using sunlight. That is why the study script says: leaves make food.";
  }
  if (lower.includes("blind") || lower.includes("audio")) {
    return "For a blind or low-vision student, the app describes the diagram from bottom to top and turns the lesson into a spoken study script.";
  }
  return "The main idea is that every plant part has a job: roots drink, stems carry, leaves make food, flowers make seeds, and fruit can protect seeds.";
}

async function answerWithOllama({ question, output, settings }) {
  const response = await fetchWithTimeout(`${ollamaUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      prompt: buildAskPrompt({ question, output, settings }),
      stream: false,
      options: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const payload = await response.json();
  return String(payload.response || "").trim() || mockAnswer(question);
}

async function answerWithGemini({ question, output, settings }) {
  const result = await generateWithGemini({
    prompt: buildAskPrompt({ question, output, settings }),
  });

  return {
    model: result.model,
    answer: result.text.trim() || mockAnswer(question),
  };
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
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && requestUrl.pathname === "/api/status") {
    sendJson(response, 200, {
      mode: runtimeMode,
      model: activeModelName(),
      hosted: runtimeMode === "gemini",
      local: runtimeMode === "ollama",
      hasGeminiKey: Boolean(geminiApiKey),
      schemaKeys,
    });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/analyze") {
    const startedAt = Date.now();
    let settings = {};

    try {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");
      settings = {
        language: payload.language || "Hindi",
        gradeBand: payload.gradeBand || "Primary school",
        profile: payload.profile || "Blind or low-vision student",
        focus: payload.focus || "Concept clarity and revision",
        teacherNote: payload.teacherNote || "",
      };

      if (runtimeMode === "mock") {
        sendJson(response, 200, {
          mode: "mock",
          model: activeModelName(),
          latencyMs: Date.now() - startedAt,
          schema: "validated",
          output: validateOutput(createDemoOutput(settings), settings),
        });
        return;
      }

      if (runtimeMode === "ollama") {
        const output = await analyzeWithOllama({
          imageDataUrl: payload.imageDataUrl || "",
          settings,
        });

        sendJson(response, 200, {
          mode: "ollama",
          model: ollamaModel,
          latencyMs: Date.now() - startedAt,
          schema: "validated",
          output,
        });
        return;
      }

      const result = await analyzeWithGemini({
        imageDataUrl: payload.imageDataUrl || "",
        settings,
      });

      sendJson(response, 200, {
        mode: "gemini",
        model: result.model,
        latencyMs: Date.now() - startedAt,
        schema: "validated",
        output: result.output,
      });
    } catch (error) {
      sendJson(response, 200, {
        mode: "fallback",
        model: activeModelName(),
        latencyMs: Date.now() - startedAt,
        schema: "fallback",
        warning: error.message,
        output: validateOutput(createDemoOutput(settings), settings),
      });
    }
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/ask") {
    const startedAt = Date.now();
    try {
      const body = await readBody(request);
      const payload = JSON.parse(body || "{}");
      const question = payload.question || "";
      const settings = payload.settings || {};

      if (runtimeMode === "mock") {
        sendJson(response, 200, {
          mode: "mock",
          latencyMs: Date.now() - startedAt,
          answer: mockAnswer(question),
        });
        return;
      }

      if (runtimeMode === "ollama") {
        const answer = await answerWithOllama({
          question,
          output: payload.output || {},
          settings,
        });
        sendJson(response, 200, {
          mode: "ollama",
          model: ollamaModel,
          latencyMs: Date.now() - startedAt,
          answer,
        });
        return;
      }

      const result = await answerWithGemini({
        question,
        output: payload.output || {},
        settings,
      });
      sendJson(response, 200, {
        mode: "gemini",
        model: result.model,
        latencyMs: Date.now() - startedAt,
        answer: result.answer,
      });
    } catch (error) {
      sendJson(response, 200, {
        mode: "fallback",
        latencyMs: Date.now() - startedAt,
        warning: error.message,
        answer: mockAnswer(""),
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
  console.log(`Analysis mode: ${runtimeMode} (${activeModelName()})`);
});
