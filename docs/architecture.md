# Echolens — Architecture

## Overview

Echolens is a Next.js application using the App Router. The prototype deliberately keeps the
architecture simple: a single Next.js server, typed local data, React state + localStorage for
user progress, and one configurable AI provider boundary. There is no separate backend, no
database, and no authentication.

The entire product is organized around one canonical loop:

```
discover topic → adaptive case study → awareness profile → perspective map
        → dynamic branches → explore claims/evidence/sources → recommendations
        → profile updates → return to case study (new questions) → repeat
```

## Stack

| Layer     | Choice                       | Role                                                                                               |
| --------- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| Framework | Next.js (App Router)         | Server components by default, server actions where appropriate, route handlers only when necessary |
| Language  | TypeScript (strict)          | All domain models are strongly typed                                                               |
| Styling   | Tailwind CSS + shadcn/ui     | Design tokens in `app/globals.css`, UI primitives in `components/ui/`                              |
| Icons     | lucide-react                 | Consistent iconography                                                                             |
| Animation | framer-motion                | Question transitions, profile reveal, branch expansion (200–500ms, reduced-motion aware)           |
| Graphs    | React Flow (`@xyflow/react`) | Knowledge-graph and perspective-map rendering                                                      |
| Charts    | recharts                     | Awareness-profile metric visualizations                                                            |

## Folder structure

```
app/                    Next.js App Router pages
  page.tsx              Topic discovery (home)
  topics/[slug]/        Topic overview → start case study
  case-study/[slug]/    Adaptive case study flow
  perspectives/[slug]/  Perspective map / dynamic branches
  profile/              Awareness profile
  recommendations/      Recommendations with explanations
components/
  ui/                   shadcn/ui primitives (button, card, badge, …)
  site-header.tsx       Persistent navigation
  topic-explorer.tsx    Discovery filters + search
  echolens-provider.tsx Client store (profiles, explored dimensions, opened sources)
  case-study/           Adaptive branching question flow
  profile/              Awareness profile dashboard (recharts radar)
  perspectives/         React Flow perspective map + animated information branches
  recommendations/      Recommendation cards with reasons
  source-drawer.tsx     Content exploration drawer with nutrition label
data/                   Typed mock content (replaces APIs/databases in prototype)
lib/
  utils.ts              cn() helper
  storage.ts            Typed localStorage persistence
  scoring.ts            Deterministic profile scoring + narratives
  source-meta.tsx       Source-type labels/icons
  ai/                   AI provider boundary (mock by default)
types/                  Foundational domain models
public/                 Static assets
docs/                   Architecture and product documentation
```

## Component model

- **Server components by default.** Pages and page sections that only render typed data are
  server components.
- **Client components where interactivity lives:** filters, the case-study question flow, the
  profile charts, and graph interactions. Marked with `"use client"`.
- **Persistence:** user progress (responses, explored dimensions, profiles, opened
  sources) is stored in `localStorage` via a typed storage layer (`lib/storage.ts`).
- **Client store:** `EcholensProvider` exposes profiles, explored dimensions, and opened sources
  through a small context backed by `useSyncExternalStore` — hydrated from localStorage without
  effects and without a global state library.
- **Scoring:** `lib/scoring.ts` deterministically derives awareness profiles from `UserResponse`s
  (metrics, explored/unexplored dimensions, preferences, neutral narratives). Exploring a
  dimension on the perspective map or opening a source updates the stored profile.

## Data flow

1. Pages import typed data from `data/` (or, later, from server-side fetches).
2. Interactive flows record `UserResponse`s and derive `AwarenessProfile` updates with
   deterministic scoring logic.
3. The perspective map and knowledge graph render `KnowledgeNode`/`KnowledgeEdge` data with
   React Flow.
4. Recommendations are selected from typed data based on the profile and always include a
   `whyRecommended` explanation.
5. AI is used only for content understanding, summaries, contextual explanations, and
   recommendation explanations — always through `lib/ai`, with deterministic fallbacks.

## Boundaries

| Concern                                                                         | Owner                                                     |
| ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Case-study branching, scoring, dimensions, graph relationships, recommendations | Deterministic logic over typed data in `data/` + `lib/`   |
| Summaries, contextual explanations, content interpretation                      | `lib/ai` provider (mock by default)                       |
| Persistence                                                                     | `localStorage`                                            |
| Rendering                                                                       | Server components + React Flow + framer-motion + recharts |

## Reliability

The application must work even if the LLM fails. Every AI call goes through the provider
boundary; when the provider is unconfigured or errors, deterministic mock responses are used.
All pages implement loading states, error states, and fallback content — the demo never becomes
a blank screen because an AI request failed.

## Visual language

Warm off-white canvas, deep navy/charcoal typography, one sophisticated teal accent, a muted
ochre secondary accent, subtle muted surfaces, restrained borders, high whitespace. Colors
communicate information hierarchy, not decoration. See the CSS variables in `app/globals.css`.

## Design decisions and constraints

- Do not introduce a new library when an existing dependency can solve the problem.
- Do not build infrastructure merely because a production system would have it.
- Hardcode or deterministically simulate anything too expensive for the prototype timeline
  rather than damaging the core architecture.
- Data structures are designed to move to PostgreSQL / a vector database / a graph database /
  external APIs later without rewriting the UI.
