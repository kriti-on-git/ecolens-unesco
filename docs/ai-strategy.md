# Echolens — AI Strategy

## Principles

- **One configurable LLM provider.** All AI calls are isolated behind `lib/ai/`. Provider-specific
  code never appears in the UI or across the application.
- **AI enhances, never owns, the journey.** Hardcoded deterministic logic controls case-study
  branching, scoring, topic dimensions, prototype recommendations, and graph relationships. AI
  is used only where it adds genuine value.
- **The demo never depends on the LLM.** If the provider is unconfigured, fails, or times out,
  deterministic mock responses keep the experience fully functional.

## What AI is used for

| Use case                                | Notes                                                                               |
| --------------------------------------- | ----------------------------------------------------------------------------------- |
| Content understanding                   | Interpreting pasted URLs / text / screenshots into structured summaries and claims  |
| Summaries                               | Condensing sources and nodes into short, neutral descriptions                       |
| Contextual explanations                 | Explaining why a dimension matters, in the user's current exploration context       |
| Recommendation explanations             | Natural-language versions of "why this was recommended"                             |
| Optional dynamic content interpretation | Labeling emotional framing, claims, and missing dimensions in user-supplied content |

## What stays deterministic

- Case-study branching (typed trees in `data/case-studies.ts`)
- Scoring and awareness-profile derivation
- Topic dimensions and perspective registry
- Prototype recommendations and their reasons
- Knowledge-graph relationships## The provider boundary (`lib/ai`)

```
lib/ai/
  types.ts   AiProvider interface, AiRequest/AiResponse, structured result types
  config.ts  Provider name, API key, model (from env; mock by default)
  mock.ts    Deterministic mock provider (never fails)
  service.ts Centralized service: structured analysis functions + deterministic fallbacks
  index.ts   getAiProvider() / generateText() + re-exports the service
```

- `AiRequest` carries an optional `context` (e.g. `intent`, topic id, dimension) so providers can
  shape responses.
- `AiResponse` always reports `provider`, `model`, and `isMock` so the UI can show provenance.
- Configuration is read from `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL` (see `.env.example`).
  With no configuration, `mock` is used and no external call is made.

## The centralized service

All structured analysis goes through `lib/ai/service.ts`. Each function calls the provider and,
if AI is unavailable or fails, falls back to a deterministic implementation built from typed
local data — the application never shows a broken state.

| Function                      | Structured output                                                                     | Deterministic fallback                   |
| ----------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------- |
| `analyzeContent(input)`       | Content understanding: summary, claims, classification, dimensions covered, nutrition | Sentence extraction + keyword heuristics |
| `interpretTopic(topic)`       | Topic summary, key claims, tensions, dimensions                                       | Built from topic + knowledge-graph data  |
| `extractClaims(text)`         | Claims with evidentiary status + hints                                                | Sentence extraction + status heuristics  |
| `explainContext(topic, kind)` | Why a dimension matters                                                               | Built from topic + dimension registry    |
| `explainRecommendation(rec)`  | Recommendation reason                                                                 | Returns the curated `whyRecommended`     |

The provider remains replaceable behind the `AiProvider` interface; provider-specific code never
appears in the frontend. A real provider's JSON output is parsed when available and falls back
to the deterministic result on any error.

### Surface: `POST /api/analyze`

The content-understanding endpoint (`app/api/analyze/route.ts`) accepts `{ text }` and returns
a structured `ContentAnalysisResult` — always functional, even with no LLM configured.

## Reliability rules

- Loading states for every AI-backed view.
- Error states with retry affordances where sensible.
- Deterministic fallback content whenever a provider call fails.
- The application must never become a blank screen because an AI request failed.

## Boundaries to respect

- No provider calls outside `lib/ai`.
- No browser-history surveillance, no private-feed access, no inference of sensitive attributes.
- Behavioral signals are limited to the user's interaction with Echolens (answers, explored
  dimensions, opened recommendations).
- Content classifications distinguish facts, claims, opinions, interpretations, and uncertainty —
  never a manufactured "truth percentage."
