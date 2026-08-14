# Echolens — Product Flow

## The canonical user journey

This loop is the core of Echolens:

```
user enters echolens
        ↓
trending topic discovery
        ↓
topic selection
        ↓
interactive case study
        ↓
user answers scenario-based questions
        ↓
echolens understands current information coverage
        ↓
awareness profile
        ↓
explored perspectives
        ↓
unexplored perspectives
        ↓
user selects an unexplored dimension
        ↓
dynamic information branch opens
        ↓
deeper nodes: claims / evidence / context / sources / related issues
        ↓
articles / reports / books / videos / primary sources
        ↓
user explores
        ↓
profile updates
        ↓
user may:
    ├── explore another dimension
    ├── view recommendations
    ├── view awareness profile
    └── return to case study
             ↓
      new questions
             ↓
      updated awareness profile
             ↓
          repeat loop
```

## Screens (initial routing)

| Route                  | Purpose                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `/`                    | Topic discovery — curated information landscape, filterable by time and category |
| `/topics/[slug]`       | Topic overview — context, why it matters, dimensions, "Start case study"         |
| `/case-study/[slug]`   | Adaptive branching case study                                                    |
| `/perspectives/[slug]` | Perspective map — "see what you may be missing"                                  |
| `/profile`             | Awareness profile dashboard                                                      |
| `/recommendations`     | Recommendations with explanations                                                |

## Screen-by-screen behavior

### 1. Topic discovery (`/`)

- Topics organized by **time** (`Happening now`, `Today`, `This week`, `Emerging discussions`)
  and **category** (politics, technology, science, literature & culture, society, economics,
  environment, history, law, education, global affairs).
- Prototype trend signals and discussion counts are hardcoded.
- The interface should feel like _"what is happening in the information ecosystem?"_ — not
  another infinite social-media feed.

### 2. Topic selection (`/topics/[slug]`)

- Shows topic title, short context, why the topic matters, and its information dimensions.
- Primary CTA: **Start case study** — never a long article dumped on the user immediately.

### 3. Interactive case study (`/case-study/[slug]`)

- Adaptive, not a conventional quiz. Questions explore assumptions, interpretation, evidence,
  priorities, possible causes, consequences, stakeholder viewpoints, uncertainty, and source
  selection.
- Options are never correct/incorrect — they reveal _how the user currently approaches the
  issue_.
- Different users experience different paths (4–13 steps depending on choices).
- The system records: dimensions encountered, dimensions ignored, evidence preference, source
  preference, stakeholder consideration, context consideration, and the reasoning path.

### 4. Awareness profile (`/profile`)

- Visually strong dashboard with metrics such as: information awareness, perspective coverage,
  evidence awareness, source diversity, context awareness, topic depth.
- Shows **what you explored** and **what you haven't explored**.
- Every score explains _why_ it exists. Never says "you are biased" — instead: _"your
  exploration has focused heavily on economic and individual-level perspectives."_

### 5. Perspective discovery (`/perspectives/[slug]`)

- Triggered by **"See what you may be missing."**
- The topic sits at the center, surrounded by unexplored dimensions (historical, legal, research,
  primary source, …). Every node is clickable.

### 6. Dynamic information branches

- Clicking a perspective node expands it into an animated branch: claims → evidence → context →
  sources (articles, reports, judgments, …).
- Staggered node appearance, subtle scaling, opacity transitions, smooth connecting lines —
  framer-motion driven, 200–500ms, respecting reduced-motion preferences.

### 7. Recommendations (`/recommendations`)

- Videos, news articles, public posts, expert commentary, research papers, books, government
  reports, court judgments, primary sources, related claims, contrasting evidence.
- Every recommendation includes: title, source, type, date, short description, relevant
  dimension, and **why it was recommended** (e.g. "covers a perspective you have not explored").

### 8. The update loop

- Returning to the case study never replays the same questions — the user receives a new
  question set or alternate branch based on dimensions they explored (e.g. a user who ignored
  historical context gets a historical-context question on the second pass).
- The profile visibly communicates change over time.

## Navigation and persistence

- The awareness profile, perspective map, recommendations, and explored content remain
  accessible throughout the experience.
- User progress survives page navigation via `localStorage`.
- The journey must feel like one coherent product, not separate demo pages.
