# Echolens — Data Model

All domain models are strongly typed and live in `types/`. Mock content lives in `data/`. The
structures are designed so they can move to PostgreSQL, a vector database, a graph database, or
external APIs later **without rewriting the UI**.

## Foundational models

Defined in `types/` (barrel-exported from `types/index.ts`):

| Model                                                                              | File                      | Purpose                                                          |
| ---------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| `Topic`, `TopicCategory`, `TopicDimension`, `TopicDimensionKind`, `TopicTimeGroup` | `types/topic.ts`          | The curated information landscape and its perspective dimensions |
| `CaseStudy`, `CaseQuestion`, `CaseOption`, `CaseQuestionType`, `UserResponse`      | `types/case-study.ts`     | Adaptive branching case studies                                  |
| `AwarenessProfile`, `ProfileMetric`, `ProfileMetricId`                             | `types/profile.ts`        | Information-coverage profile for a topic                         |
| `KnowledgeNode`, `KnowledgeEdge`, `KnowledgeGraph`, `KnowledgeNodeType`            | `types/knowledge.ts`      | Neo4j-shaped graph data rendered with React Flow                 |
| `Source`, `NutritionLabel`, `ContentClassification`                                | `types/source.ts`         | Sources with information nutrition labels                        |
| `Recommendation`, `RecommendationReasonKind`                                       | `types/recommendation.ts` | Recommendations with explicit reasons                            |
| `ContentAnalysis`                                                                  | `types/analysis.ts`       | Analysis of pasted URLs / text / screenshots                     |

## Mock data

Hardcoded prototype content in `data/`:

| File                       | Contents                                                            |
| -------------------------- | ------------------------------------------------------------------- |
| `data/topics.ts`           | Curated demo topics with time groups, trend signals, and dimensions |
| `data/categories.ts`       | The 11 topic categories                                             |
| `data/perspectives.ts`     | Registry of all dimension kinds (single source of truth for labels) |
| `data/case-studies.ts`     | Branching case-study trees + second-pass follow-up branches         |
| `data/sources.ts`          | Mock sources with nutrition labels                                  |
| `data/recommendations.ts`  | Mock recommendations with `whyRecommended` reasons                  |
| `data/knowledge-graphs.ts` | Typed nodes + edges per topic                                       |

## Model notes

### Topic

```ts
Topic {
  id, slug, title, subtitle, summary, whyItMatters,
  categoryId, timeGroup, trendSignal, discussionCount,
  dimensions: TopicDimension[]
}
```

`timeGroup` (`happening-now | today | this-week | emerging`) and `trendSignal`/`discussionCount`
are prototype signals that map onto trending-news APIs later.

### Case study

```ts
CaseStudy {
  id, slug, topicId, title, intro,
  entryQuestionId,
  questions: Record<string, CaseQuestion>,
  followUpBranches?: Record<TopicDimensionKind, CaseQuestion[]>
}
```

`CaseOption.nextQuestionId` drives branching — each answer routes the user onto a different
path, so paths differ per user. `followUpBranches` keyed by dimension enable the second-pass
"new questions" loop: a user who ignored a dimension gets a question about it on their next
attempt.

### Awareness profile

```ts
AwarenessProfile {
  topicId, attempt, metrics: ProfileMetric[],
  exploredDimensions, unexploredDimensions,
  evidencePreference, sourcePreference,
  reasoningPath: string[], narrative
}
```

Metrics are 0–100 with an `explanation` each. The profile describes the user's **interaction and
coverage for one topic** — never their identity.

### Knowledge graph

```ts
KnowledgeNode { id, label, type, dimensionKind?, summary, level, sourceIds?, metadata? }
KnowledgeEdge { id, sourceId, targetId, relation }  // supports | contradicts | contextualizes | …
```

`level` drives vertical layout; `relation` is a typed edge label. This maps directly onto a
Neo4j model (`(:Topic)-[:HAS_DIMENSION]->(:Dimension)-[:HOSTS]->(:Claim)-[:SUPPORTED_BY]->
(:Evidence)-[:DRAWN_FROM]->(:Source)`).

### Source & nutrition label

Every source carries a `NutritionLabel` (source, publication date, evidence availability,
primary-source availability, context availability, emotional framing, related perspectives,
source diversity) and a `ContentClassification` (`verified-fact | disputed-claim | opinion |
interpretation | insufficient-evidence`). There is **no** manufactured "truth percentage."

## Future migrations (without UI rewrites)

| Prototype                  | Future                                                    |
| -------------------------- | --------------------------------------------------------- |
| `data/topics.ts`           | Trending news APIs + PostgreSQL `topics` table            |
| `data/case-studies.ts`     | Content database (`case_studies`, `questions`, `options`) |
| `data/sources.ts`          | Search/news APIs + PostgreSQL `sources` table             |
| `data/knowledge-graphs.ts` | Neo4j graph database                                      |
| `data/recommendations.ts`  | Recommendation service over the graph + embeddings        |
| `localStorage` progress    | Server-backed user state (when auth is added)             |
| `lib/ai` mock provider     | Real LLM provider behind the same interface               |
