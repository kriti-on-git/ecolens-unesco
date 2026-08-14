'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye, RotateCcw } from 'lucide-react';
import { useEcholens } from '@/components/echolens-provider';
import { SourceDrawer } from '@/components/source-drawer';
import { getDimension } from '@/data/perspectives';
import { getKnowledgeGraph, getSourcesByIds, sources } from '@/data';
import { sourceTypeIcon, sourceTypeLabel } from '@/lib/source-meta';
import { cn } from '@/lib/utils';
import type { Source, Topic, TopicDimensionKind } from '@/types';

interface InfoNodeData {
  label: string;
  tag?: string;
  kind: 'topic' | 'dimension' | 'claim' | 'evidence' | 'source';
  summary?: string;
  selected?: boolean;
  opened?: boolean;
  explored?: boolean;
  dimensionKind?: TopicDimensionKind;
  sourceId?: string;
}

function InfoNode({ data }: NodeProps) {
  const { label, tag, kind, selected, opened, explored } = data as unknown as InfoNodeData;
  const clickable = kind !== 'topic';
  return (
    <div
      className={cn(
        'bg-card max-w-52 min-w-36 rounded-lg border px-3 py-2 shadow-sm',
        selected && 'border-primary ring-primary/40 ring-1',
        opened && 'border-dashed',
        clickable && 'hover:border-primary/60 cursor-pointer transition-colors',
        kind === 'topic' && 'border-primary/50 bg-primary/5',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {tag && kind !== 'topic' ? (
          <p className="text-muted-foreground text-[9px] font-semibold tracking-[0.14em] uppercase">
            {tag}
          </p>
        ) : (
          <span />
        )}
        {(opened || (kind === 'dimension' && explored)) && (
          <span
            className="bg-primary size-1.5 shrink-0 rounded-full"
            title={kind === 'dimension' ? 'Explored' : 'Opened'}
            aria-label={kind === 'dimension' ? 'Explored' : 'Opened'}
          />
        )}
      </div>
      <p className="text-[13px] leading-snug font-medium">{label}</p>
      <Handle
        type="target"
        position={Position.Top}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
      />
    </div>
  );
}

const nodeTypes: NodeTypes = { info: InfoNode };

const EDGE_STYLE = { stroke: '#cbc4b8', strokeWidth: 1.2 };

interface BranchNode {
  id: string;
  label: string;
  summary: string;
  sourceIds: string[];
}

interface BranchData {
  kind: TopicDimensionKind;
  label: string;
  description: string;
  context: string;
  claims: BranchNode[];
  evidence: BranchNode[];
  sources: Source[];
  stakeholders: BranchNode[];
  relatedIssues: BranchNode[];
}

export function PerspectiveMap({ topic }: { topic: Topic }) {
  return (
    <ReactFlowProvider>
      <PerspectiveMapInner topic={topic} />
    </ReactFlowProvider>
  );
}

function PerspectiveMapInner({ topic }: { topic: Topic }) {
  const graph = useMemo(() => getKnowledgeGraph(topic.id), [topic.id]);
  const { markDimensionsExplored, openedNodes, markNodeOpened, getExplored } = useEcholens();
  const explored = getExplored(topic.id);

  const [selectedKind, setSelectedKind] = useState<TopicDimensionKind | null>(null);
  const [activeSource, setActiveSource] = useState<Source | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const { fitView } = useReactFlow();

  const elements = useMemo(
    () => buildElements(topic, graph, selectedKind, openedNodes, explored),
    [topic, graph, selectedKind, openedNodes, explored],
  );

  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.2, duration: 450 }), 80);
    return () => clearTimeout(timer);
  }, [selectedKind, fitView]);

  const branch = useMemo(
    () => (selectedKind ? buildBranch(topic, graph, selectedKind) : null),
    [topic, graph, selectedKind],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const data = node.data as unknown as InfoNodeData;
      if (data.kind === 'dimension' && data.dimensionKind) {
        setSelectedKind(data.dimensionKind);
        markDimensionsExplored(topic, [data.dimensionKind]);
      } else if (data.kind === 'source' && data.sourceId) {
        markNodeOpened(node.id);
        const source = getSourcesByIds([data.sourceId])[0];
        if (source) setActiveSource(source);
      } else if (data.kind === 'claim' || data.kind === 'evidence') {
        markNodeOpened(node.id);
        setExpandedNodes((prev) => {
          const next = new Set(prev);
          if (next.has(node.id)) next.delete(node.id);
          else next.add(node.id);
          return next;
        });
      }
    },
    [markDimensionsExplored, markNodeOpened, topic],
  );

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="border-border/70 h-[440px] overflow-hidden rounded-xl border bg-[radial-gradient(circle_at_center,var(--card)_0%,var(--muted)/35_100%)] sm:h-[520px]">
        <ReactFlow
          nodes={elements.nodes}
          edges={elements.edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.35}
          maxZoom={1.6}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2dccf" gap={22} size={1.2} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </div>

      <aside className="space-y-4">
        {branch ? (
          <BranchPanel
            branch={branch}
            expandedNodes={expandedNodes}
            onToggleNode={(id) =>
              setExpandedNodes((prev) => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id);
                else next.add(id);
                return next;
              })
            }
            onOpenSource={setActiveSource}
            onReset={() => setSelectedKind(null)}
          />
        ) : (
          <MapLegend topic={topic} />
        )}
      </aside>

      <SourceDrawer
        source={activeSource}
        topicId={topic.id}
        onClose={() => setActiveSource(null)}
      />
    </div>
  );
}

function MapLegend({ topic }: { topic: Topic }) {
  return (
    <div className="border-border/70 bg-card rounded-xl border p-5">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Eye className="text-primary size-4" aria-hidden />
        The information map
      </p>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
        {topic.title} sits at the center, surrounded by the dimensions this issue can be explored
        from. Click any dimension to open its information branch — claims, evidence, context, and
        sources.
      </p>
      <ul className="text-muted-foreground mt-4 space-y-2 text-xs">
        {topic.dimensions.map((d) => (
          <li key={d.id} className="flex items-start gap-2">
            <span className="bg-primary/70 mt-1 size-1.5 shrink-0 rounded-full" aria-hidden />
            <span>{d.description}</span>
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground border-border/60 mt-4 border-t pt-3 text-[11px]">
        <span className="bg-primary mr-1 inline-block size-1.5 rounded-full" aria-hidden />
        Dimensions you&apos;ve already explored are marked on the map.
      </p>
    </div>
  );
}

function BranchPanel({
  branch,
  expandedNodes,
  onToggleNode,
  onOpenSource,
  onReset,
}: {
  branch: BranchData;
  expandedNodes: Set<string>;
  onToggleNode: (id: string) => void;
  onOpenSource: (source: Source) => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      key={branch.kind}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="border-border/70 bg-card rounded-xl border p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-primary text-[10px] font-semibold tracking-[0.16em] uppercase">
            Information branch
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">{branch.label}</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors"
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Full map
        </button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{branch.description}</p>

      <BranchSection
        title="Context"
        items={[
          { id: 'context', label: 'Why this matters', summary: branch.context, sourceIds: [] },
        ]}
        expandedNodes={expandedNodes}
        onToggleNode={onToggleNode}
        emptyText=""
        accent
      />
      <BranchSection
        title="Claims"
        items={branch.claims}
        expandedNodes={expandedNodes}
        onToggleNode={onToggleNode}
        emptyText="No claims mapped for this dimension yet."
      />
      <BranchSection
        title="Evidence"
        items={branch.evidence}
        expandedNodes={expandedNodes}
        onToggleNode={onToggleNode}
        emptyText="No evidence mapped for this dimension yet."
      />
      <BranchSection
        title="Stakeholders"
        items={branch.stakeholders}
        expandedNodes={expandedNodes}
        onToggleNode={onToggleNode}
        emptyText="No stakeholders mapped for this topic yet."
      />
      <BranchSection
        title="Related issues"
        items={branch.relatedIssues}
        expandedNodes={expandedNodes}
        onToggleNode={onToggleNode}
        emptyText="No related issues mapped for this topic yet."
      />

      <div className="mt-5">
        <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.16em] uppercase">
          Sources & content
        </p>
        {branch.sources.length ? (
          <ul className="mt-2 space-y-2">
            {branch.sources.map((source, i) => (
              <motion.li
                key={source.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => onOpenSource(source)}
                  className="border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-muted/50 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors"
                >
                  <span className="text-primary mt-0.5 shrink-0">
                    {sourceTypeIcon(source.type, 'size-4')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] leading-snug font-medium">
                      {source.title}
                    </span>
                    <span className="text-muted-foreground mt-0.5 block text-[11px]">
                      {sourceTypeLabel(source.type)} · {source.sourceName}
                      {source.publishedAt ? ` · ${source.publishedAt}` : ''}
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-2 text-xs">
            No sources tagged for this dimension yet — explore a different branch.
          </p>
        )}
      </div>
    </motion.div>
  );
}

function BranchSection({
  title,
  items,
  expandedNodes,
  onToggleNode,
  emptyText,
  accent = false,
}: {
  title: string;
  items: BranchNode[];
  expandedNodes: Set<string>;
  onToggleNode: (id: string) => void;
  emptyText: string;
  accent?: boolean;
}) {
  return (
    <div className="mt-5">
      <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.16em] uppercase">
        {title}
      </p>
      {items.length ? (
        <ul className="mt-2 space-y-2">
          {items.map((item, i) => {
            const open = expandedNodes.has(item.id);
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => onToggleNode(item.id)}
                  className={cn(
                    'flex w-full items-start justify-between gap-2 rounded-lg border p-3 text-left transition-colors',
                    accent
                      ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                      : 'border-border/60 bg-muted/30 hover:bg-muted/50',
                  )}
                >
                  <span className="min-w-0">
                    <span className="block text-[13px] leading-snug font-medium">{item.label}</span>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-muted-foreground block overflow-hidden text-[12px] leading-relaxed"
                        >
                          {item.summary}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  <ChevronDown
                    className={cn(
                      'text-muted-foreground mt-0.5 size-3.5 shrink-0 transition-transform',
                      open && 'rotate-180',
                    )}
                    aria-hidden
                  />
                </button>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted-foreground mt-2 text-xs">{emptyText}</p>
      )}
    </div>
  );
}

function buildElements(
  topic: Topic,
  graph: ReturnType<typeof getKnowledgeGraph>,
  selectedKind: TopicDimensionKind | null,
  openedNodes: string[],
  explored: TopicDimensionKind[],
): { nodes: Node[]; edges: Edge[] } {
  if (selectedKind) {
    const branch = buildBranch(topic, graph, selectedKind);
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
      id: `dim-${branch.kind}`,
      type: 'info',
      position: { x: -110, y: -180 },
      data: {
        label: branch.label,
        tag: 'Dimension',
        kind: 'dimension',
        selected: true,
        explored: explored.includes(branch.kind),
        dimensionKind: branch.kind,
      },
    });

    const claimNodes = branch.claims.map((c, i) => ({
      id: `claim-${c.id}`,
      type: 'info' as const,
      position: { x: (i - (branch.claims.length - 1) / 2) * 250, y: -20 },
      data: {
        label: c.label,
        tag: 'Claim',
        kind: 'claim',
        summary: c.summary,
        opened: openedNodes.includes(`claim-${c.id}`),
      },
    }));
    const evidenceNodes = branch.evidence.map((e, i) => ({
      id: `evidence-${e.id}`,
      type: 'info' as const,
      position: { x: (i - (branch.evidence.length - 1) / 2) * 250, y: 130 },
      data: {
        label: e.label,
        tag: 'Evidence',
        kind: 'evidence',
        summary: e.summary,
        opened: openedNodes.includes(`evidence-${e.id}`),
      },
    }));
    const sourceNodes = branch.sources.map((s, i) => ({
      id: `source-${s.id}`,
      type: 'info' as const,
      position: { x: (i - (branch.sources.length - 1) / 2) * 250, y: 300 },
      data: {
        label: s.title,
        tag: sourceTypeLabel(s.type),
        kind: 'source',
        sourceId: s.id,
        summary: s.description,
        opened: openedNodes.includes(`source-${s.id}`),
      },
    }));
    nodes.push(...claimNodes, ...evidenceNodes, ...sourceNodes);

    // Use the typed graph relationships when available (dim → claim → evidence → source).
    const flowIdByGraphId = new Map<string, string>();
    if (graph) {
      const dimNode = graph.nodes.find(
        (n) => n.type === 'dimension' && n.dimensionKind === branch.kind,
      );
      if (dimNode) flowIdByGraphId.set(dimNode.id, `dim-${branch.kind}`);
    }
    branch.claims.forEach((c) => flowIdByGraphId.set(c.id, `claim-${c.id}`));
    branch.evidence.forEach((e) => flowIdByGraphId.set(e.id, `evidence-${e.id}`));
    branch.sources.forEach((s) => flowIdByGraphId.set(s.id, `source-${s.id}`));

    graph?.edges.forEach((ge) => {
      const source = flowIdByGraphId.get(ge.sourceId);
      const target = flowIdByGraphId.get(ge.targetId);
      if (source && target) {
        edges.push({
          id: `ge-${ge.id}`,
          source,
          target,
          style: EDGE_STYLE,
          animated: false,
        });
      }
    });

    // Fallback links for graphs without explicit edges (e.g. dimension → claims).
    if (edges.length === 0) {
      branch.claims.forEach((c) =>
        edges.push({
          id: `edge-c-${c.id}`,
          source: `dim-${branch.kind}`,
          target: `claim-${c.id}`,
          style: EDGE_STYLE,
        }),
      );
      branch.claims.forEach((c, i) => {
        const ev = branch.evidence[i];
        if (ev)
          edges.push({
            id: `edge-ce-${c.id}`,
            source: `claim-${c.id}`,
            target: `evidence-${ev.id}`,
            style: EDGE_STYLE,
          });
      });
    }

    return { nodes, edges };
  }

  // Full map: topic at center, dimensions on a ring.
  const nodes: Node[] = [
    {
      id: `topic-${topic.id}`,
      type: 'info',
      position: { x: -110, y: -40 },
      data: { label: topic.title, tag: 'Topic', kind: 'topic' },
    },
  ];
  const edges: Edge[] = [];
  const count = topic.dimensions.length;
  topic.dimensions.forEach((d, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const radius = 250;
    nodes.push({
      id: `dim-${d.kind}`,
      type: 'info',
      position: { x: Math.cos(angle) * radius - 110, y: Math.sin(angle) * radius - 40 },
      data: {
        label: getDimension(d.kind).label,
        tag: getDimension(d.kind).tag,
        kind: 'dimension',
        explored: explored.includes(d.kind),
        dimensionKind: d.kind,
      },
    });
    edges.push({
      id: `edge-td-${d.kind}`,
      source: `topic-${topic.id}`,
      target: `dim-${d.kind}`,
      style: EDGE_STYLE,
    });
  });
  return { nodes, edges };
}

function buildBranch(
  topic: Topic,
  graph: ReturnType<typeof getKnowledgeGraph>,
  kind: TopicDimensionKind,
): BranchData {
  const dim = topic.dimensions.find((d) => d.kind === kind) ?? getDimension(kind);
  const graphClaims: BranchNode[] =
    graph?.nodes
      .filter((n) => n.type === 'claim' && n.dimensionKind === kind)
      .map((n) => ({
        id: n.id,
        label: n.label,
        summary: n.summary,
        sourceIds: n.sourceIds ?? [],
      })) ?? [];
  const graphEvidence: BranchNode[] =
    graph?.nodes
      .filter((n) => n.type === 'evidence' && n.dimensionKind === kind)
      .map((n) => ({
        id: n.id,
        label: n.label,
        summary: n.summary,
        sourceIds: n.sourceIds ?? [],
      })) ?? [];

  const graphSourceIds = [...graphClaims, ...graphEvidence].flatMap((n) => n.sourceIds);
  const graphSources = getSourcesByIds(graphSourceIds);
  const fallbackSources = sources.filter((s) => s.dimensionKinds.includes(kind));
  const sourceSet = new Map<string, Source>();
  [...graphSources, ...fallbackSources].forEach((s) => sourceSet.set(s.id, s));

  const stakeholders: BranchNode[] =
    graph?.nodes
      .filter((n) => n.type === 'stakeholder')
      .map((n) => ({ id: n.id, label: n.label, summary: n.summary, sourceIds: [] })) ?? [];
  const relatedIssues: BranchNode[] =
    graph?.nodes
      .filter((n) => n.type === 'related-issue')
      .map((n) => ({ id: n.id, label: n.label, summary: n.summary, sourceIds: [] })) ?? [];

  return {
    kind,
    label: dim.label,
    description: dim.description,
    context: `${topic.whyItMatters} ${dim.description}`,
    claims: graphClaims,
    evidence: graphEvidence,
    sources: [...sourceSet.values()],
    stakeholders,
    relatedIssues,
  };
}
