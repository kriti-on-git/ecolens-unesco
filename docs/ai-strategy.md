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
- Knowledge-graph relationships

## The provider boundary (`lib/ai`)

```
lib/ai/
  types.ts   AiProvider interface, AiRequest, AiResponse
  config.ts  Provider name, API key, model (from env; mock by default)
  mock.ts    Deterministic mock provider (never fails)
  index.ts   getAiProvider() / generateText() — the only public entry points
```

- `AiRequest` carries an optional `context` (e.g. `intent: "summarize" | "explain" |
"recommend"`, topic id, explored dimensions) so providers can shape responses.
- `AiResponse` always reports `provider`, `model`, and `isMock` so the UI can show provenance.
- Configuration is read from `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL` (see `.env.example`).
  With no configuration, `mock` is used and no external call is made.

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
