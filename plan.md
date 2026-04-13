# Implement SaaS Idea Validator Dashboard UI

## Summary
- Replace the empty authenticated `/dashboard` with the SaaS Idea Validator as the main workspace.
- Reuse the existing Kokonut AI patterns already in the repo: base the composer on `components/kokonutui/ai-prompt.tsx` styling/textarea behavior, and reuse `components/kokonutui/ai-loading.tsx` for mocked analysis/research states.
- Build the full demo flow client-side with realistic mocked data and explicit state transitions: empty, loading, intake, review, generated, and error.

## Key Changes
- **Authenticated shell**
  - Update `app/(authenticated)/layout.tsx` to render the existing `LayoutOne` shell so the validator lives inside the app’s sidebar/header structure.
  - Keep the route at `/dashboard`.
  - Replace the unrelated sidebar group label (`waitlists`) with product-specific copy for this app, while keeping a single Dashboard nav item so routing stays simple.

- **Feature architecture**
  - Turn `app/(authenticated)/dashboard/page.tsx` into a thin entry that renders a new client feature root under `components/idea-validator/`.
  - Organize the feature into these components:
    - `idea-validator-workspace`
    - `validator-composer`
    - `questionnaire-panel`
    - `research-results-panel`
    - `feature-review-panel`
    - `prd-panel`
    - `evaluation-panel`
    - `summary-rail`
  - Drive the whole experience with a single `useReducer` state machine:
    - `idle`
    - `intake`
    - `research_loading`
    - `research_results`
    - `feature_review`
    - `prd_ready`
    - `evaluation_ready`
    - `error`
  - Add typed mock data/service modules for:
    - simple-flow questions
    - detailed-flow missing-info prompts
    - uploaded files
    - competitors
    - extracted features
    - PRD sections
    - idea evaluation metrics
    - promise-based simulated delays and retryable failures

- **Main workspace UI**
  - Top section is a hero composer card that becomes the product’s main entry point.
  - Composer behavior:
    - auto-resizing textarea
    - `Upload Files` button
    - `Simple` / `Detailed` mode toggle
    - attached file chips with remove actions
    - primary submit action
  - Under the composer, show a persistent step strip:
    - Intake
    - Research
    - Features
    - PRD
    - Validation
  - Desktop layout: main content left, sticky summary rail right.
  - Mobile layout: summary rail collapses into tabs/accordion; use `Drawer` for deep-detail views.

- **Simple flow**
  - After the initial idea is submitted, show a guided assistant-style questionnaire one prompt at a time.
  - Each question supports selectable options and, when relevant, a free-text answer path.
  - Required intake fields:
    - target audience
    - user pain points
    - problem being solved
    - industry / niche
    - willingness to pay
    - business context
  - Allow Back/Edit until intake is complete.
  - Once complete, transition into mocked research loading, then show competitors and extracted features.

- **Detailed flow**
  - Detailed mode requires either pasted PRD text or at least one uploaded file before submission.
  - Run a mocked “PRD analysis” pass to detect missing:
    - target audience
    - customer needs
    - core problem
    - value proposition
  - Only ask follow-up questions for the missing fields.
  - After that, merge into the same downstream steps as Simple:
    - competitor research
    - feature extraction
    - feature approval/rejection
    - PRD generation/refinement
    - evaluation

- **Research, feature review, PRD, evaluation**
  - Research results:
    - competitor cards with name, positioning, audience, pricing badge, saturation signal
    - feature previews on each card
    - full competitor details in `Dialog` on desktop and `Drawer` on mobile
  - Feature review:
    - each extracted feature starts as `pending`
    - user can `Approve` or `Reject`
    - approved features feed the PRD requirements
    - rejected features go into an “Excluded / Not now” PRD section
  - PRD view:
    - read-only structured tabs/sections
    - Overview
    - Audience & JTBD
    - Core Problem
    - Value Proposition
    - Functional Requirements
    - User Flow
    - Risks & Success Metrics
    - include light demo CTAs like Copy / Export stub, but no real export backend
  - Idea evaluation:
    - one overall success score
    - four metric rows with percentage, short explanation, and reasoning:
      - competitor landscape strength
      - market saturation
      - customer willingness to pay
      - execution clarity

- **States and polish**
  - Empty state: composer-led landing with sample prompt ideas.
  - Loading state: Kokonut loading animation plus skeletons/status copy.
  - Reviewing state: feature approval UI is the active focus.
  - Generated state: PRD and evaluation visible together.
  - Error state: dedicated retry/reset card.
  - Add a small non-primary “Demo states” overflow action so error state can be shown intentionally during demos.

## Interfaces / Types
- No public backend/API changes in this pass.
- Add internal typed contracts for future backend swap-in:
  - `ValidatorMode`
  - `ValidatorStage`
  - `Question`
  - `QuestionOption`
  - `UploadedAsset`
  - `CompetitorProfile`
  - `FeatureCandidate`
  - `PRDSection`
  - `IdeaEvaluationMetric`
  - `IdeaEvaluation`

## Test Plan
- Manual: `/dashboard` renders correctly in empty state on desktop and mobile.
- Manual: Simple flow completes end-to-end from idea input to evaluation.
- Manual: Detailed flow blocks empty submission, accepts text/files, asks only missing-field follow-ups, then reaches the same downstream stages.
- Manual: uploaded file chips add/remove correctly.
- Manual: approving/rejecting features updates counts and PRD content immediately.
- Manual: competitor detail modal/drawer works at both breakpoints.
- Manual: retry/reset/error-demo actions recover to a valid state.
- Verification: run `eslint .` after implementation.

## Assumptions
- `/dashboard` is now the app’s main product workspace.
- File upload is UI-only for v1: filenames and state transitions are real, but there is no parsing, storage, or backend integration yet.
- The PRD is read-only in this pass; refinement happens by rerunning the flow, not inline editing.
- Styling stays within the current Inter + shadcn/Tailwind system, with polish coming from layout, motion, hierarchy, and data-rich cards rather than a new brand system.
