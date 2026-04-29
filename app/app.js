const sampleImage = "./assets/sample-classroom-page.svg";

const mockGemmaOutput = {
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

const previewImage = document.querySelector("#previewImage");
const imageInput = document.querySelector("#imageInput");
const sampleButton = document.querySelector("#sampleButton");
const analyzeButton = document.querySelector("#analyzeButton");
const languageSelect = document.querySelector("#languageSelect");
const loadingState = document.querySelector("#loadingState");
const speakButton = document.querySelector("#speakButton");

const teacherTab = document.querySelector("#teacherTab");
const studentTab = document.querySelector("#studentTab");
const teacherMode = document.querySelector("#teacherMode");
const studentMode = document.querySelector("#studentMode");

let currentImageDataUrl = "";

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderOutput(output) {
  document.querySelector("#lessonPlan").innerHTML = list(output.teacherLessonPlan);
  document.querySelector("#worksheet").innerHTML = list(output.worksheet);
  document.querySelector("#differentiated").innerHTML = list(output.differentiatedVersions);
  document.querySelector(
    "#translation",
  ).innerHTML = `<p><strong>${languageSelect.value} demo:</strong> ${output.localLanguageVersion}</p>`;
  document.querySelector("#audioScript").textContent = output.audioStudyScript;
  document.querySelector("#screenReaderSummary").textContent = output.screenReaderSummary;
  document.querySelector("#visualDescription").textContent = output.visualDescription;
  document.querySelector("#studentPractice").innerHTML = list(output.studentPractice);
}

function setMode(mode) {
  const isTeacher = mode === "teacher";
  teacherTab.classList.toggle("active", isTeacher);
  studentTab.classList.toggle("active", !isTeacher);
  teacherTab.setAttribute("aria-selected", String(isTeacher));
  studentTab.setAttribute("aria-selected", String(!isTeacher));
  teacherMode.classList.toggle("active", isTeacher);
  studentMode.classList.toggle("active", !isTeacher);
  teacherMode.hidden = !isTeacher;
  studentMode.hidden = isTeacher;
}

function speakStudyScript() {
  const text = document.querySelector("#audioScript").textContent;

  if (!("speechSynthesis" in window) || !text) {
    speakButton.textContent = "Audio unavailable";
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92;
  utterance.pitch = 1;
  utterance.onend = () => {
    speakButton.textContent = "Play audio";
  };
  speakButton.textContent = "Stop audio";
  window.speechSynthesis.speak(utterance);
}

imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentImageDataUrl = reader.result;
    previewImage.src = currentImageDataUrl;
    previewImage.alt = "Uploaded classroom material awaiting analysis";
  });
  reader.readAsDataURL(file);
});

sampleButton.addEventListener("click", () => {
  previewImage.src = sampleImage;
  previewImage.alt = "Sample textbook page about plant parts with a simple diagram";
  currentImageDataUrl = "";
  imageInput.value = "";
});

async function analyzeImage() {
  loadingState.hidden = false;
  analyzeButton.disabled = true;

  try {
    if (window.location.protocol === "file:") {
      renderOutput(mockGemmaOutput);
      return;
    }

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: currentImageDataUrl,
        language: languageSelect.value,
      }),
    });
    const payload = await response.json();
    renderOutput(payload.output || mockGemmaOutput);
  } catch (error) {
    renderOutput(mockGemmaOutput);
  } finally {
    loadingState.hidden = true;
    analyzeButton.disabled = false;
  }
}

analyzeButton.addEventListener("click", analyzeImage);

teacherTab.addEventListener("click", () => setMode("teacher"));
studentTab.addEventListener("click", () => setMode("student"));

speakButton.addEventListener("click", () => {
  if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    speakButton.textContent = "Play audio";
    return;
  }

  speakStudyScript();
});

languageSelect.addEventListener("change", () => renderOutput(mockGemmaOutput));

renderOutput(mockGemmaOutput);
