# Project Plan

## Product Positioning

Classroom Access Kit is an offline inclusive classroom and study engine. It is not only a lesson generator and not only an accessibility tool. It supports the teacher and the learner from the same classroom input.

## Users

- Teachers in low-connectivity schools
- Blind or visually impaired students
- Dyslexic or struggling readers
- Language-diverse learners
- Rural and community classrooms where privacy, cost, and internet access matter

## MVP Scope

The MVP should prove the complete story with one strong classroom example.

Input:

- One uploaded classroom image, such as a textbook page, blackboard photo, worksheet, chart, or diagram

Outputs:

- Teacher lesson plan
- Worksheet or quiz
- Differentiated beginner/average/advanced explanations
- Simplified explanation
- Local-language translation
- Screen-reader-friendly summary
- Step-by-step visual description
- Audio-friendly study script
- Student practice questions

## Demo Flow

1. Show the problem: one classroom, one textbook page, unreliable internet, multiple learning needs.
2. Upload or capture a classroom image.
3. Run local Gemma 4 analysis.
4. Switch between Teacher Mode and Student Study Mode.
5. Show inclusive outputs generated from the same source.
6. Emphasize that a blind or visually impaired student can study independently.

## Build Phases

### Phase 1: Functional Prototype

- Create app shell with upload flow
- Add Teacher Mode and Student Study Mode
- Define structured output schema
- Add mocked sample response for UI development
- Prepare one polished demo example

### Phase 2: Gemma 4 Integration

- Connect local Gemma 4 runtime through Ollama or LiteRT
- Send image and task instructions to model
- Parse structured JSON outputs
- Add fallback handling for malformed responses

### Phase 3: Accessibility and Export

- Add screen-reader-friendly result layout
- Add text-to-speech or exportable study script
- Add printable worksheet export
- Add language selection

### Phase 4: Submission Package

- Record 3-minute demo video
- Publish public repository
- Prepare live demo or downloadable local demo
- Write Kaggle submission
- Add cover image and media assets

## Success Criteria

- The demo clearly shows real-world impact.
- The app works with at least one real classroom image.
- Gemma 4 usage is visible in the architecture and code.
- The output is useful to both teachers and blind or visually impaired students.
- The project can be explained clearly in under 3 minutes.

