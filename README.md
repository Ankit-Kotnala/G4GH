# Classroom Access Kit

An offline-first AI classroom and study assistant for the Gemma 4 Good Hackathon.

Classroom Access Kit helps teachers in low-connectivity classrooms turn one photo of classroom material into inclusive teaching resources. It also helps blind and visually impaired students study the same material independently through audio-friendly, screen-reader-friendly explanations.

## Core Aim

The project has two connected goals:

1. Help teachers teach better offline.
2. Help blind and visually impaired students study independently.

A teacher or student can upload or capture a photo of a textbook page, blackboard, worksheet, handwritten note, chart, diagram, or classroom object. Gemma 4 analyzes the material locally and generates useful outputs for teaching, studying, accessibility, and revision.

## MVP Experience

The first functional demo should show one classroom image becoming:

- a teacher lesson plan
- a printable worksheet or quiz
- a simplified explanation
- a local-language version
- a screen-reader-friendly summary
- an audio-friendly study explanation for a blind or visually impaired student
- practice questions for independent revision

## Why Gemma 4

The app is designed around Gemma 4 capabilities:

- multimodal understanding for classroom photos, diagrams, handwriting, and textbook pages
- local-first inference through Ollama or LiteRT
- long-context reasoning for full lesson material
- tool/function calling for OCR, translation, worksheet export, text-to-speech, and structured output generation

## Target Tracks

- Future of Education
- Digital Equity & Inclusivity
- Ollama or LiteRT Special Technology Track

## Submission Deliverables

The hackathon submission needs:

- Kaggle writeup under 1,500 words
- public video demo, 3 minutes or less
- public code repository
- live demo or downloadable demo files
- media gallery with cover image

## Current Status

A polished end-to-end prototype is in place. It includes:

- image upload, camera capture, drag-and-drop, and sample demo flow
- local language, grade band, learner profile, and teaching focus settings
- Teacher Mode with lesson plan, activity, worksheet, differentiation, assessment, and translation
- Student Study Mode with screen-reader summary, visual description, audio study script, vocabulary, practice questions, and follow-up Q&A
- Gemma Trace view with runtime mode, model name, latency, schema status, and confidence notes
- print worksheet and copy study pack actions
- mock mode for reliable judging plus an Ollama/Gemma runtime path for local inference

Open `app/index.html` in a browser for the static fallback experience, or run the local server for the full prototype.

You can also run the local prototype server:

```bash
npm run dev
```

By default the server uses mock output. To call a local Ollama runtime instead:

```bash
USE_MOCK=false GEMMA_MODEL=gemma4 npm run dev
```

The prototype also exposes:

- `GET /api/status`
- `POST /api/analyze`
- `POST /api/ask`

## Next Engineering Step

Test the Ollama path on the demo machine with the target Gemma 4 model, then record the 3-minute submission video using the built-in judge demo flow.
