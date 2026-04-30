# Architecture

## System Overview

Classroom Access Kit is planned as a local-first web app with a lightweight backend that talks to a local Gemma 4 runtime.

```text
Classroom image
   |
   v
Web app upload/camera UI
   |
   v
Backend analysis endpoint
   |
   v
Gemma 4 local runtime
   |
   v
Structured classroom outputs
   |
   +--> Teacher Mode UI
   +--> Student Study Mode UI
   +--> Gemma Trace UI
```

## Main Components

### Frontend

- Image upload or camera capture
- Drag-and-drop sample flow for demos
- Language, grade band, learner profile, and teaching focus controls
- Mode switcher for Teacher Mode and Student Study Mode
- Gemma Trace view for runtime and schema transparency
- Accessible output panels
- Printable worksheet view
- Screen-reader-friendly study view
- Browser text-to-speech for the audio study script
- Follow-up Q&A against the generated lesson pack

### Backend

- Accepts uploaded image and user settings
- Builds Gemma 4 prompt
- Calls local model runtime
- Validates structured response
- Returns normalized output to the frontend
- Provides a status endpoint and a lesson Q&A endpoint

The current prototype includes a dependency-free Node server at `server/server.js`. It serves the app and exposes `GET /api/status`, `POST /api/analyze`, and `POST /api/ask`. Mock mode is enabled by default so the UI can be demonstrated reliably before the local Gemma runtime is installed.

### Local Model Runtime

Target options:

- Ollama for a local desktop demo
- LiteRT for an edge/mobile-oriented track if feasible

The first implementation should target Ollama because it is fast to demonstrate locally. LiteRT can remain a stretch goal if we have time.

## Structured Output Shape

The model response should be normalized into sections such as:

- `sourceSummary`
- `contentSignals`
- `teacherLessonPlan`
- `classroomActivity`
- `worksheet`
- `differentiatedVersions`
- `assessmentRubric`
- `simplifiedExplanation`
- `localLanguageVersion`
- `visualDescription`
- `screenReaderSummary`
- `audioStudyScript`
- `studentPractice`
- `keyVocabulary`
- `confidenceNotes`

## Accessibility Requirements

- Results must be readable by screen readers.
- Student Study Mode should avoid visually dependent wording.
- Visual descriptions should move from overview to details.
- Audio study scripts should be conversational and structured.
- Controls should be keyboard-accessible.

## Technical Risks

- Local Gemma 4 multimodal setup may require model/runtime-specific handling.
- OCR and handwriting quality may vary by image.
- Structured JSON output may need validation and repair.
- Text-to-speech support may differ between browser and local environments.

## Demo Strategy

The demo should use one strong sample image and show the full pipeline. If live model latency is high, the app can cache the latest generated result while still showing the real local inference path in code and writeup.
