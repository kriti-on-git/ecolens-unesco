# Echolens

**We don't tell you what to think. We show you what you may be missing.**

Echolens is an AI-powered information and media literacy companion. It helps people understand
what information they have encountered, which perspectives they have considered, what evidence
exists, what context may be missing, and how their understanding changes after exploration.

It is **not** a tool that tells users what to believe, grades their opinions, or labels them as
biased. It makes the information ecosystem visible and encourages critical thinking through
interaction.

This repository contains the Echolens application: a Next.js product with a typed data model,
curated content, adaptive learning experiences, and an AI layer behind a single provider
boundary.

## The experience

- **Topic discovery** — a living landscape of issues organized by time and category, with
  search and trending signals
- **Adaptive case studies** — branching, scenario-based explorations with no right or wrong
  answers; each choice reveals how you approach an issue and routes you down a different path,
  with second-pass questions about the ground you skipped
- **Awareness profiles** — a dashboard that describes your _information coverage_ (perspectives
  explored, evidence engaged, gaps remaining) — never a diagnosis of who you are
- **Perspective maps** — interactive knowledge graphs that connect a topic's dimensions,
  claims, evidence, and sources, so you can see where every claim leads and what backs it up
- **Recommendations** — sources and content surfaced because they cover an unexplored
  perspective or back a claim you met — always with an explicit reason, and always with an
  **information nutrition label** so you can judge the source before you draw conclusions

## Tech stack

| Layer     | Choice                                                                       |
| --------- | ---------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org) (App Router, server components by default)     |
| Language  | [TypeScript](https://www.typescriptlang.org) (strict mode)                   |
| Styling   | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Icons     | [lucide-react](https://lucide.dev)                                           |
| Animation | [framer-motion](https://www.framer.com/motion)                               |
| Graphs    | [React Flow](https://reactflow.dev) (`@xyflow/react`)                        |
| Charts    | [recharts](https://recharts.org)                                             |
| Quality   | ESLint, Prettier, TypeScript strict mode                                     |

## Getting started

Requirements: Node.js 20+.

```bash
# install dependencies
npm install

# run the development server
npm run dev

# open http://localhost:3000
```

No external services are required to run the application — it works fully offline with the
built-in content and AI provider.

### AI provider

All AI calls are isolated behind [`lib/ai/`](./lib/ai). The application ships with a
deterministic provider that generates structured analysis from the typed content — reliable,
instant, and fully offline. To use a real LLM instead, copy `.env.example` to `.env.local` and
set the variables:

```bash
LLM_PROVIDER=openai        # or "anthropic"
LLM_API_KEY=your_key_here
LLM_MODEL=your_model
```

The application never depends on the LLM: if it fails or is unconfigured, the built-in provider
keeps the experience intact.

## Commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the development server      |
| `npm run build`        | Create a production build         |
| `npm start`            | Run the production build          |
| `npm run lint`         | Run ESLint                        |
| `npm run format`       | Format all files with Prettier    |
| `npm run format:check` | Verify formatting without writing |

## Repository structure

```
app/            Next.js App Router pages (topic discovery, case study, profile, …)
components/     React components (ui primitives + feature components)
data/           Typed content (topics, case studies, sources, knowledge graphs, …)
docs/           Architecture and product documentation
lib/            Utilities, scoring, storage, and the AI provider boundary
public/         Static assets
types/          Foundational domain models shared across the app
```

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — technical architecture and boundaries
- [`docs/product-flow.md`](./docs/product-flow.md) — the canonical user journey
- [`docs/data-model.md`](./docs/data-model.md) — typed data models and future migrations
- [`docs/ai-strategy.md`](./docs/ai-strategy.md) — AI boundaries and fallback strategy
- [`docs/future-architecture.md`](./docs/future-architecture.md) — production-scale vision
- [`docs/build_status.md`](./docs/build_status.md) — what is built and verified, for the team
- [`project_base.md`](./project_base.md) — project overview and philosophy

## Development philosophy

- Build **vertically**: complete user journey → interaction → visual quality → AI → edge cases.
- Preserve the architecture: reuse existing components and utilities, never replace a working
  implementation with a more complicated one.
- No unnecessary infrastructure: no databases, auth, or external APIs required to run the
  product.
