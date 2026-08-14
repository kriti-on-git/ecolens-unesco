# Build Status

_Last updated: 2026-08-15_

A running status of what is built, what is verified, and what is next. This document is meant
for the team — anyone should be able to read it and know exactly where the prototype stands.

## What is built

### 1. Foundation (prompt 1) — complete ✅

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS v4 + shadcn/ui + ESLint + Prettier
- Strongly typed domain models in [`types/`](../types): topics, categories, dimensions, case
  studies, awareness profiles, knowledge graphs, sources (with nutrition labels),
  recommendations, content analysis
- Typed mock content in [`data/`](../data): 9 curated topics, categories, 3 branching case
  studies, sources, knowledge graphs, recommendations
- Initial routing (`/`, `/topics/[slug]`, `/case-study/[slug]`, `/perspectives/[slug]`,
  `/profile`, `/recommendations`) plus a friendly 404
- Design tokens per the visual direction (warm off-white, deep navy, teal accent)
- Architecture documentation (`docs/architecture.md`, `docs/product-flow.md`,
  `docs/data-model.md`, `docs/ai-strategy.md`, `docs/future-architecture.md`)

### 2. Product experience (prompt 2) — complete ✅

- Home → topic discovery: trending topics, category chips, time groups, search
- Adaptive branching case study flow (no quiz aesthetics): scenario + prompt, option cards
  with dimension tags, "what this reveals" explanations, progress bar, path chips
- Second-pass **follow-up questions about skipped dimensions**
- Awareness profile dashboard: overall score ring, 6 metrics with explanations, radar chart,
  explored/unexplored dimensions, reasoning path, evidence/source preferences
- Perspective map (React Flow): topic at center, dimension ring, animated information
  branches (dimension → claims → evidence → context → sources → content)
- Recommendations with "why recommended" reasons, filters, slide-in drawer with the full
  **information nutrition label**
- Persistent user state (localStorage) with a `useSyncExternalStore` provider — no global
  state library

### 3. Functional intelligence (prompt 3) — complete ✅

- Deterministic, explainable scoring across all 6 metrics; coverage stays topic-scoped;
  generic preference derivation; formalized gap detection (`detectGaps`)
- 3 full adaptive case studies (AI regulation, election misinformation, urban housing),
  each with branching paths and second-pass follow-up branches
- Knowledge graphs per topic incl. **stakeholders** and **related issues**
- 20 curated recommendations reusing the shared source registry
- Centralized, replaceable AI service (`lib/ai/service.ts`): `analyzeContent`,
  `interpretTopic`, `extractClaims`, `explainContext`, `explainRecommendation` — every call
  goes through the provider boundary and falls back to deterministic implementations
- `POST /api/analyze` route exposing the AI service (structured JSON)
- Expanded user-state persistence: answers per topic, last-selected topic (continue card on
  home), explored dimensions, opened graph nodes, viewed recommendations

### 4. Stabilization & polish (prompt 4) — in progress (mostly complete) ✅

- Provider no-op update guard (no redundant writes/re-renders)
- Focus-visible accessibility styles + drawer focus management
- Topic discovery card category labels
- Perspective map explored-dimension indicators + legend
- **Bugfix: state wipe on page reload.** A full-page refresh could overwrite all saved
  progress because a tracking effect could run before the store loaded from localStorage.
  `update()` now always starts from the persisted store. Verified: profiles survive reloads,
  and the pass-2 follow-up flow works after a refresh.
- **End-to-end journey verified in a real headless browser** (Chrome DevTools Protocol) —
  see below.

## Verification status

| Gate                                 | Status                                   |
| ------------------------------------ | ---------------------------------------- |
| `npm run lint`                       | ✅ passing                               |
| `npm run build`                      | ✅ passing                               |
| `npm run format:check`               | ✅ passing                               |
| Route sweep (all pages)              | ✅ all 200 (unknown slug → 404)          |
| AI endpoint (`/api/analyze`)         | ✅ structured output, 400 on empty input |
| End-to-end journey (headless Chrome) | ✅ 10/10 checks                          |

The end-to-end journey drives the real product with real input events: completes the case
study first pass, verifies profile persistence, opens a dimension branch on the perspective
map, opens the source drawer with the nutrition label, completes the second-pass follow-up
questions, renders the profile dashboard, renders all 20 recommendation cards, opens the
recommendation drawer, and shows the continue-exploring card on home.

## What is intentionally NOT built

- Real LLM integration — the AI service is mocked deterministically; wiring a real provider
  is a config change (see `.env.example`)
- Server-side user accounts / auth / databases — everything persists in the browser
  (localStorage)
- Real content pipelines — all topics, sources, case studies, and graphs are curated mock
  data designed to be replaced by APIs later

## How to run

```bash
npm install
npm run dev        # development
npm run build      # production build
npm start          # serve the production build
```

## Next steps (suggested)

1. Wire a real LLM provider behind `lib/ai/` (config already exists) and evaluate the
   quality of generated explanations vs. the deterministic fallbacks
2. Replace `data/` mocks with a real content API + database
3. Add multi-user profiles (auth) and server-side persistence
4. Broaden case studies + knowledge graphs to all 9 topics
5. Visual QA pass in real browsers (the prototype is verified headless; a designer's eye
   will catch layout/typography details)
