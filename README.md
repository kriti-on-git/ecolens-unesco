# Echolens

**We don't tell you what to think. We show you what you may be missing.**

Echolens is an AI-powered information and media literacy companion. It helps people understand
what information they have encountered, which perspectives they have considered, what evidence
exists, what context may be missing, and how their understanding changes after exploration.

It is **not** a tool that tells users what to believe, grades their opinions, or labels them as
biased. It makes the information ecosystem visible and encourages critical thinking through
interaction.

This repository contains the **prototype foundation** for Echolens: a Next.js application with a
typed data model, mock content, initial routing, and full documentation. The complete product
experience (adaptive case studies, awareness profiles, knowledge graphs, recommendations) is
built on top of this foundation.

## Prototype scope

This is a ~20-hour prototype, not a production system. It demonstrates the complete Echolens
experience through a reliable vertical slice:

- Curated topic discovery organized by time and category (hardcoded prototype signals)
- Adaptive, branching case studies (hardcoded trees — no right/wrong answers)
- Awareness profiles that describe _information coverage_, not identity
- Perspective maps and dynamic information branches
- Knowledge graph visualizations (typed local data rendered with React Flow)
- Recommendations that always explain _why_ they were recommended
- Deterministic mock AI behind a single configurable provider boundary

Hardcoded prototype data (topics, case studies, sources, graphs, recommendations) lives in
[`data/`](./data) and is designed to be replaced by real APIs and databases later **without
rewriting the UI**.

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

No environment variables or external services are required — the prototype runs entirely on
deterministic local data and the mock AI provider.

### Optional: enable a real LLM

All AI calls are isolated behind [`lib/ai/`](./lib/ai). To switch from the deterministic mock to
a real provider, copy `.env.example` to `.env.local` and set the variables there:

```bash
LLM_PROVIDER=openai        # or "anthropic"
LLM_API_KEY=your_key_here
LLM_MODEL=your_model
```

The application never depends on the LLM: if it fails or is unconfigured, deterministic fallback
content keeps the experience intact.

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
data/           Typed mock content (topics, case studies, sources, graphs, …)
docs/           Architecture and product documentation
lib/            Utilities and the AI provider boundary
public/         Static assets
types/          Foundational domain models shared across the app
```

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) — technical architecture and boundaries
- [`docs/product-flow.md`](./docs/product-flow.md) — the canonical user journey
- [`docs/data-model.md`](./docs/data-model.md) — typed data models and future migrations
- [`docs/ai-strategy.md`](./docs/ai-strategy.md) — AI boundaries and fallback strategy
- [`docs/future-architecture.md`](./docs/future-architecture.md) — production-scale vision
- [`project_base.md`](./project_base.md) — project overview and philosophy

## Development philosophy

- Build **vertically**: complete user journey → interaction → visual quality → AI → edge cases.
- Preserve the architecture: reuse existing components and utilities, never replace a working
  implementation with a more complicated one.
- No unnecessary infrastructure: no databases, auth, or external APIs in the prototype unless
  genuinely required by the experience.
