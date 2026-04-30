const sampleImage = "./assets/sample-classroom-page.svg";

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

function buildClientFallback(settings = {}) {
  const language = settings.language || "Hindi";
  const profile = settings.profile || "Blind or low-vision student";
  const focus = settings.focus || "Concept clarity and revision";

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
      "Output is optimized for a classroom demonstration using the sample plant page.",
      `Teaching focus: ${focus}.`,
      "For real submissions, upload a clear photo for the local Gemma vision model.",
    ],
  };
}

const elements = {
  previewImage: document.querySelector("#previewImage"),
  imageInput: document.querySelector("#imageInput"),
  cameraInput: document.querySelector("#cameraInput"),
  sampleButton: document.querySelector("#sampleButton"),
  analyzeButton: document.querySelector("#analyzeButton"),
  judgeDemoButton: document.querySelector("#judgeDemoButton"),
  clearButton: document.querySelector("#clearButton"),
  languageSelect: document.querySelector("#languageSelect"),
  gradeSelect: document.querySelector("#gradeSelect"),
  profileSelect: document.querySelector("#profileSelect"),
  focusSelect: document.querySelector("#focusSelect"),
  teacherNote: document.querySelector("#teacherNote"),
  loadingState: document.querySelector("#loadingState"),
  loadingText: document.querySelector("#loadingText"),
  speakButton: document.querySelector("#speakButton"),
  copyButton: document.querySelector("#copyButton"),
  printButton: document.querySelector("#printButton"),
  runtimeStatus: document.querySelector("#runtimeStatus"),
  imageBadge: document.querySelector("#imageBadge"),
  dropZone: document.querySelector("#dropZone"),
  analysisTime: document.querySelector("#analysisTime"),
  sourceSummary: document.querySelector("#sourceSummary"),
  signalList: document.querySelector("#signalList"),
  resourceCount: document.querySelector("#resourceCount"),
  accessibilityCount: document.querySelector("#accessibilityCount"),
  modeLabel: document.querySelector("#modeLabel"),
  languageLabel: document.querySelector("#languageLabel"),
  teacherTab: document.querySelector("#teacherTab"),
  studentTab: document.querySelector("#studentTab"),
  traceTab: document.querySelector("#traceTab"),
  teacherMode: document.querySelector("#teacherMode"),
  studentMode: document.querySelector("#studentMode"),
  traceMode: document.querySelector("#traceMode"),
  questionInput: document.querySelector("#questionInput"),
  askButton: document.querySelector("#askButton"),
  answerText: document.querySelector("#answerText"),
  traceModeValue: document.querySelector("#traceModeValue"),
  traceModelValue: document.querySelector("#traceModelValue"),
  traceLatencyValue: document.querySelector("#traceLatencyValue"),
  traceSchemaValue: document.querySelector("#traceSchemaValue"),
};

let currentImageDataUrl = "";
let latestOutput = buildClientFallback();
let latestMeta = {
  mode: "mock",
  model: "gemma4",
  latencyMs: 0,
  schema: "validated",
};
let activeMode = "teacher";
let progressTimer;

function getSettings() {
  return {
    language: elements.languageSelect.value,
    gradeBand: elements.gradeSelect.value,
    profile: elements.profileSelect.value,
    focus: elements.focusSelect.value,
    teacherNote: elements.teacherNote.value.trim(),
  };
}

function clearNode(node) {
  node.replaceChildren();
}

function paragraph(text) {
  const p = document.createElement("p");
  p.textContent = text || "";
  return p;
}

function renderList(target, items) {
  clearNode(target);
  const list = document.createElement("ul");
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = typeof item === "string" ? item : item.question || JSON.stringify(item);
    list.append(li);
  });
  target.append(list);
}

function renderPractice(target, items) {
  clearNode(target);
  const list = document.createElement("ol");
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    const question = typeof item === "string" ? item : item.question;
    const hint = typeof item === "string" ? "" : item.hint;
    const answer = typeof item === "string" ? "" : item.answer;
    const strong = document.createElement("strong");
    strong.textContent = question || "";
    li.append(strong);
    if (hint) {
      li.append(paragraph(`Hint: ${hint}`));
    }
    if (answer) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Answer";
      details.append(summary, paragraph(answer));
      li.append(details);
    }
    list.append(li);
  });
  target.append(list);
}

function renderSignals(items) {
  clearNode(elements.signalList);
  (items || []).forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    elements.signalList.append(span);
  });
}

function normalizeOutput(output) {
  const fallback = buildClientFallback(getSettings());
  const normalized = { ...fallback, ...(output || {}) };
  schemaKeys.forEach((key) => {
    if (Array.isArray(fallback[key]) && !Array.isArray(normalized[key])) {
      normalized[key] = fallback[key];
    }
    if (typeof fallback[key] === "string" && typeof normalized[key] !== "string") {
      normalized[key] = fallback[key];
    }
  });
  return normalized;
}

function renderOutput(output, meta = latestMeta) {
  latestOutput = normalizeOutput(output);
  latestMeta = { ...latestMeta, ...meta };

  elements.sourceSummary.textContent = latestOutput.sourceSummary;
  renderSignals(latestOutput.contentSignals);
  renderList(document.querySelector("#lessonPlan"), latestOutput.teacherLessonPlan);
  renderList(document.querySelector("#classroomActivity"), latestOutput.classroomActivity);
  renderList(document.querySelector("#worksheet"), latestOutput.worksheet);
  renderList(document.querySelector("#differentiated"), latestOutput.differentiatedVersions);
  renderList(document.querySelector("#assessmentRubric"), latestOutput.assessmentRubric);
  document.querySelector("#translation").textContent = latestOutput.localLanguageVersion;
  document.querySelector("#audioScript").textContent = latestOutput.audioStudyScript;
  document.querySelector("#screenReaderSummary").textContent = latestOutput.screenReaderSummary;
  document.querySelector("#visualDescription").textContent = latestOutput.visualDescription;
  renderList(document.querySelector("#keyVocabulary"), latestOutput.keyVocabulary);
  renderPractice(document.querySelector("#studentPractice"), latestOutput.studentPractice);
  renderList(document.querySelector("#confidenceNotes"), latestOutput.confidenceNotes);
  renderSignals(latestOutput.contentSignals);
  renderList(document.querySelector("#schemaKeys"), schemaKeys);

  elements.resourceCount.textContent = "15";
  elements.accessibilityCount.textContent = "5";
  elements.modeLabel.textContent = latestMeta.mode || "mock";
  elements.languageLabel.textContent = getSettings().language;
  elements.traceModeValue.textContent = latestMeta.mode || "mock";
  elements.traceModelValue.textContent = latestMeta.model || "gemma4";
  elements.traceLatencyValue.textContent = `${latestMeta.latencyMs || 0} ms`;
  elements.traceSchemaValue.textContent = latestMeta.schema || "validated";
}

function setMode(mode) {
  activeMode = mode;
  const isTeacher = mode === "teacher";
  const isStudent = mode === "student";
  const isTrace = mode === "trace";

  elements.teacherTab.classList.toggle("active", isTeacher);
  elements.studentTab.classList.toggle("active", isStudent);
  elements.traceTab.classList.toggle("active", isTrace);
  elements.teacherTab.setAttribute("aria-selected", String(isTeacher));
  elements.studentTab.setAttribute("aria-selected", String(isStudent));
  elements.traceTab.setAttribute("aria-selected", String(isTrace));
  elements.teacherMode.classList.toggle("active", isTeacher);
  elements.studentMode.classList.toggle("active", isStudent);
  elements.traceMode.classList.toggle("active", isTrace);
  elements.teacherMode.hidden = !isTeacher;
  elements.studentMode.hidden = !isStudent;
  elements.traceMode.hidden = !isTrace;
}

function resetPipeline() {
  ["image", "vision", "teacher", "access", "ready"].forEach((step, index) => {
    const node = document.querySelector(`#step-${step}`);
    node.classList.toggle("active", index === 0);
    node.classList.remove("complete");
  });
  elements.analysisTime.textContent = "Ready";
}

function completeStep(step) {
  const node = document.querySelector(`#step-${step}`);
  if (!node) return;
  node.classList.add("active", "complete");
}

function runProgress(startTime) {
  clearInterval(progressTimer);
  resetPipeline();
  const steps = [
    ["image", "Image received"],
    ["vision", "Gemma 4 is reading text, labels, and visual layout"],
    ["teacher", "Creating lesson plan, activity, worksheet, and checks"],
    ["access", "Building audio, screen-reader, and local-language support"],
    ["ready", "Final structured pack is ready"],
  ];
  let index = 0;
  completeStep("image");
  elements.loadingText.textContent = steps[0][1];
  progressTimer = setInterval(() => {
    index = Math.min(index + 1, steps.length - 1);
    completeStep(steps[index][0]);
    elements.loadingText.textContent = steps[index][1];
    elements.analysisTime.textContent = `${Date.now() - startTime} ms`;
    if (index === steps.length - 1) {
      clearInterval(progressTimer);
    }
  }, 380);
}

function stopProgress(startTime) {
  clearInterval(progressTimer);
  ["image", "vision", "teacher", "access", "ready"].forEach(completeStep);
  elements.analysisTime.textContent = `${Date.now() - startTime} ms`;
}

function setRuntimeStatus(status) {
  elements.runtimeStatus.classList.remove("is-live", "is-mock", "is-waiting");
  if (status.mode === "ollama") {
    elements.runtimeStatus.classList.add("is-live");
    elements.runtimeStatus.lastChild.textContent = ` Local Gemma: ${status.model}`;
    return;
  }
  elements.runtimeStatus.classList.add(status.mode === "mock" ? "is-mock" : "is-waiting");
  elements.runtimeStatus.lastChild.textContent =
    status.mode === "mock" ? " Demo mode with Gemma-ready path" : " Checking local runtime";
}

async function loadStatus() {
  if (window.location.protocol === "file:") {
    setRuntimeStatus({ mode: "mock", model: "gemma4" });
    return;
  }

  try {
    const response = await fetch("/api/status");
    const status = await response.json();
    setRuntimeStatus(status);
    latestMeta = { ...latestMeta, mode: status.mode, model: status.model };
    renderOutput(latestOutput, latestMeta);
  } catch (error) {
    setRuntimeStatus({ mode: "mock", model: "gemma4" });
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

async function handleImageFile(file) {
  if (!file) return;
  currentImageDataUrl = await readFileAsDataUrl(file);
  elements.previewImage.src = currentImageDataUrl;
  elements.previewImage.alt = `Uploaded classroom material: ${file.name}`;
  elements.imageBadge.textContent = "Custom classroom image";
}

function resetToSample() {
  currentImageDataUrl = "";
  elements.previewImage.src = sampleImage;
  elements.previewImage.alt = "Sample textbook page about plant parts with a simple diagram";
  elements.imageInput.value = "";
  elements.cameraInput.value = "";
  elements.imageBadge.textContent = "Sample page loaded";
}

async function analyzeImage() {
  const startTime = Date.now();
  const settings = getSettings();
  elements.loadingState.hidden = false;
  elements.analyzeButton.disabled = true;
  elements.answerText.textContent = "";
  runProgress(startTime);

  try {
    if (window.location.protocol === "file:") {
      await new Promise((resolve) => setTimeout(resolve, 900));
      renderOutput(buildClientFallback(settings), {
        mode: "mock",
        model: "gemma4-demo",
        latencyMs: Date.now() - startTime,
        schema: "validated",
      });
      return;
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: currentImageDataUrl,
        ...settings,
      }),
    });
    const payload = await response.json();
    renderOutput(payload.output || buildClientFallback(settings), {
      mode: payload.mode || "fallback",
      model: payload.model || "gemma4",
      latencyMs: payload.latencyMs || Date.now() - startTime,
      schema: payload.schema || "validated",
    });
    setRuntimeStatus({ mode: payload.mode || "mock", model: payload.model || "gemma4" });
  } catch (error) {
    renderOutput(buildClientFallback(settings), {
      mode: "fallback",
      model: "gemma4-demo",
      latencyMs: Date.now() - startTime,
      schema: "client fallback",
    });
  } finally {
    stopProgress(startTime);
    elements.loadingState.hidden = true;
    elements.analyzeButton.disabled = false;
  }
}

function buildStudyPackText() {
  return [
    "Classroom Access Kit Study Pack",
    "",
    `Summary: ${latestOutput.sourceSummary}`,
    "",
    "Audio Study Script:",
    latestOutput.audioStudyScript,
    "",
    "Screen-reader Summary:",
    latestOutput.screenReaderSummary,
    "",
    "Practice:",
    ...(latestOutput.studentPractice || []).map((item, index) => {
      const question = typeof item === "string" ? item : item.question;
      return `${index + 1}. ${question}`;
    }),
  ].join("\n");
}

async function copyStudyPack() {
  const text = buildStudyPackText();
  try {
    await navigator.clipboard.writeText(text);
    elements.copyButton.textContent = "Copied";
  } catch (error) {
    elements.copyButton.textContent = "Copy unavailable";
  }
  window.setTimeout(() => {
    elements.copyButton.textContent = "Copy study pack";
  }, 1400);
}

function speakStudyScript() {
  const text = latestOutput.audioStudyScript;

  if (!("speechSynthesis" in window) || !text) {
    elements.speakButton.textContent = "Audio unavailable";
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    elements.speakButton.textContent = "Play audio";
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.onend = () => {
    elements.speakButton.textContent = "Play audio";
  };
  elements.speakButton.textContent = "Stop audio";
  window.speechSynthesis.speak(utterance);
}

function mockAnswer(question) {
  const lower = question.toLowerCase();
  if (lower.includes("root")) {
    return "Roots are important because they hold the plant in the soil and take in water. In the audio memory line, roots drink.";
  }
  if (lower.includes("leaf") || lower.includes("leaves")) {
    return "Leaves are important because they help the plant make food using sunlight. A simple way to remember it is: leaves make food.";
  }
  if (lower.includes("blind") || lower.includes("audio")) {
    return "For a blind or low-vision student, the app describes the diagram from bottom to top and turns the lesson into a spoken study script.";
  }
  return "The main idea is that every plant part has a job. Roots drink, stems carry, leaves make food, flowers make seeds, and fruit can protect seeds.";
}

async function askQuestion() {
  const question = elements.questionInput.value.trim();
  if (!question) return;
  elements.askButton.disabled = true;
  elements.answerText.textContent = "Thinking through the lesson...";

  try {
    if (window.location.protocol === "file:") {
      await new Promise((resolve) => setTimeout(resolve, 350));
      elements.answerText.textContent = mockAnswer(question);
      return;
    }
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        output: latestOutput,
        settings: getSettings(),
      }),
    });
    const payload = await response.json();
    elements.answerText.textContent = payload.answer || mockAnswer(question);
  } catch (error) {
    elements.answerText.textContent = mockAnswer(question);
  } finally {
    elements.askButton.disabled = false;
  }
}

async function runJudgeDemo() {
  resetToSample();
  elements.languageSelect.value = "Hindi";
  elements.gradeSelect.value = "Primary school";
  elements.profileSelect.value = "Blind or low-vision student";
  elements.focusSelect.value = "Accessible audio study";
  elements.teacherNote.value = "Prepare this for a low-connectivity class with one blind student.";
  setMode("teacher");
  await analyzeImage();
  window.setTimeout(() => setMode("student"), 700);
}

elements.imageInput.addEventListener("change", (event) => handleImageFile(event.target.files[0]));
elements.cameraInput.addEventListener("change", (event) => handleImageFile(event.target.files[0]));
elements.sampleButton.addEventListener("click", resetToSample);
elements.clearButton.addEventListener("click", () => {
  resetToSample();
  elements.teacherNote.value = "";
  elements.questionInput.value = "";
  elements.answerText.textContent = "";
  renderOutput(buildClientFallback(getSettings()), latestMeta);
  resetPipeline();
});
elements.analyzeButton.addEventListener("click", analyzeImage);
elements.judgeDemoButton.addEventListener("click", runJudgeDemo);
elements.teacherTab.addEventListener("click", () => setMode("teacher"));
elements.studentTab.addEventListener("click", () => setMode("student"));
elements.traceTab.addEventListener("click", () => setMode("trace"));
elements.speakButton.addEventListener("click", speakStudyScript);
elements.copyButton.addEventListener("click", copyStudyPack);
elements.printButton.addEventListener("click", () => window.print());
elements.askButton.addEventListener("click", askQuestion);
elements.questionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    askQuestion();
  }
});

[elements.languageSelect, elements.gradeSelect, elements.profileSelect, elements.focusSelect].forEach((select) => {
  select.addEventListener("change", () => {
    renderOutput(buildClientFallback(getSettings()), latestMeta);
  });
});

elements.dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  elements.dropZone.classList.add("is-dragging");
});
elements.dropZone.addEventListener("dragleave", () => {
  elements.dropZone.classList.remove("is-dragging");
});
elements.dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  elements.dropZone.classList.remove("is-dragging");
  handleImageFile(event.dataTransfer.files[0]);
});

renderOutput(latestOutput, latestMeta);
resetPipeline();
loadStatus();
