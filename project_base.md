# Echolens — Project Base

## What Echolens is

Echolens is an AI-powered information and media literacy companion. Its purpose is not to tell
users _what to believe_ or _which side is correct_. Instead it helps users understand:

- what information they have encountered
- what perspectives they have considered
- what evidence they have encountered
- what dimensions they have not considered
- what context may be missing
- how different claims connect to evidence and sources
- how their understanding changes after exploration

**Core value proposition:** _We don't tell you what to think. We show you what you may be
missing._

## Product philosophy

- Do not tell users what to believe.
- Do not decide which perspective is correct.
- Do not label users as biased, stupid, ignorant, or politically aligned.
- Do not manipulate users toward an ideology.
- Do not optimize recommendations purely for engagement.
- Make the information ecosystem visible.
- Expose missing context, evidence, and perspectives.
- Encourage critical thinking through interaction.
- Distinguish facts, claims, opinions, interpretations, and uncertainty.
- Explain why information is being recommended.
- Preserve user agency.

## Privacy

Echolens never claims to monitor a user's complete browsing history, private messages, private
social feeds, or private communications. The prototype operates on:

- selected topics
- public/trending topics
- user-entered topics
- pasted URLs
- pasted text
- uploaded screenshots/documents (where implemented)
- curated demo content

Behavioral signals are used only to understand the user's interaction with Echolens. The
"awareness profile" describes the user's interaction and information coverage for the _selected
topic_ — never their identity — and is never presented as a personality diagnosis.

## Prototype posture

This is a ~20-hour prototype. The priority order is:

1. Complete user journey
2. Correct interaction
3. Visual quality
4. AI integration
5. Edge cases
6. Infrastructure

Hardcoding prototype content is intentional and documented: trending topics, case-study trees,
perspective dimensions, knowledge-graph relationships, recommendation sources, and demo scoring
rules. The architecture makes every one of these replaceable with real APIs or databases later.

## Prohibited in the prototype

No Kubernetes, microservices, Kafka, Redis, Neo4j, Qdrant, complex RAG infrastructure,
LangGraph, multi-agent orchestration, custom ML training, browser-history surveillance,
social-media scraping, authentication (unless required), payment systems, unnecessary databases,
or unnecessary state-management libraries. These belong to the future architecture only.

See [`docs/future-architecture.md`](./docs/future-architecture.md) for the production vision.
