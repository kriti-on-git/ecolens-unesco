# Echolens — Future Architecture

This document describes the production-scale vision. **None of this is implemented in the
prototype.** The prototype is a Next.js app with typed local data, localStorage persistence, and
a mock AI provider. The future architecture exists to guide how the prototype's data structures
are shaped so they can migrate without UI rewrites.

## Prototype vs production

| Concern          | Prototype (now)                            | Future production                                        |
| ---------------- | ------------------------------------------ | -------------------------------------------------------- |
| Framework        | Next.js (App Router)                       | Next.js (App Router)                                     |
| Data             | Typed local data in `data/`                | PostgreSQL + typed repositories                          |
| Knowledge graph  | Typed nodes/edges rendered with React Flow | Neo4j graph database                                     |
| Semantic search  | None                                       | Vector database + embeddings                             |
| Ingestion        | Hardcoded curated content                  | Distributed ingestion of news/search APIs                |
| AI               | Deterministic mock provider in `lib/ai`    | Real LLM provider behind the same boundary               |
| Recommendations  | Rule-based over typed data                 | Graph + embedding-based recommendation service           |
| User state       | `localStorage`                             | Server-backed sessions (when auth is required)           |
| Analytics        | None                                       | Privacy-preserving analytics (interaction coverage only) |
| External content | None                                       | News APIs, search APIs, content integrations             |

## Target architecture (conceptual)

```
┌─────────────────────────────────────────────┐
│ Next.js application (server components)     │
│  pages · server actions · route handlers    │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ Application services                        │
│  case-study engine (deterministic)          │
│  profile/scoring engine (deterministic)     │
│  recommendation service                     │
│  content-analysis service                   │
└───────┬──────────────┬──────────────┬───────┘
        │              │              │
┌───────▼───────┐ ┌────▼─────┐ ┌──────▼──────┐
│ PostgreSQL    │ │ Neo4j    │ │ Vector DB   │
│ topics,       │ │ knowledge│ │ embeddings, │
│ sources,      │ │ graph    │ │ semantic    │
│ profiles      │ │          │ │ search      │
└───────────────┘ └──────────┘ └─────────────┘
        │              │              │
        └──────┬───────┴──────┬───────┘
               │              │
       ┌───────▼──────┐ ┌─────▼──────────┐
       │ LLM provider │ │ Ingestion      │
       │ (lib/ai)     │ │ pipeline       │
       │              │ │ (news/search   │
       │              │ │  APIs)         │
       └──────────────┘ └────────────────┘
```

## Explicitly out of scope (prototype)

The prototype does **not** include: Kubernetes, microservices, Kafka, Redis, Neo4j, Qdrant,
complex RAG infrastructure, LangGraph, multi-agent orchestration, custom ML training,
browser-history surveillance, social-media scraping, authentication (unless required), payment
systems, unnecessary databases, or unnecessary state-management libraries.

## Migration path

1. **Data layer:** replace `data/*` modules with repository functions over PostgreSQL using the
   existing `types/*` contracts — the UI is unchanged.
2. **Knowledge graph:** export `data/knowledge-graphs.ts` to a Neo4j instance using the same
   node/edge shape; React Flow rendering is unchanged.
3. **Semantic layer:** index sources with embeddings and add retrieval to the content-analysis
   and recommendation flows.
4. **Recommendations:** replace rule-based selection with a service that combines graph
   traversal and embeddings, keeping `whyRecommended` as a first-class output.
5. **AI:** enable a real provider in `lib/ai/config.ts` behind the existing `AiProvider`
   interface, with the deterministic mock retained as the fallback.
6. **Auth & user state:** when required, move `localStorage` progress into server-backed
   sessions; the awareness-profile model is already topic-scoped and identity-neutral.
