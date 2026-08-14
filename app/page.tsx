import { ContinueExploring } from '@/components/continue-exploring';
import { TopicExplorer } from '@/components/topic-explorer';
import { topicCategories, topics } from '@/data';

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
      <section className="max-w-2xl">
        <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">Echolens</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          What&apos;s happening in the information ecosystem?
        </h1>
        <p className="text-muted-foreground mt-4 text-base leading-relaxed">
          A curated landscape of the issues being discussed right now. Pick a topic and explore the
          claims, evidence, and perspectives behind it. We don&apos;t tell you what to think — we
          show you what you may be missing.
        </p>
      </section>

      <ContinueExploring />

      <TopicExplorer topics={topics} categories={topicCategories} />
    </div>
  );
}
