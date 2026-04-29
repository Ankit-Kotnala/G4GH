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

Planning docs and the first static prototype are in place.

Open `app/index.html` in a browser to try the current prototype. It uses mocked Gemma output while the local model runtime is being connected.

## Next Engineering Step

Connect the analysis flow to a local Gemma 4 runtime, starting with Ollama if available on the demo machine.

