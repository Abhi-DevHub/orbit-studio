'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { parseDSL, type ParseResult } from '@/lib/dsl-parser';
import { autoLayout } from '@/lib/auto-layout';
import { useCanvasStore } from '@/stores/canvas-store';

const DEFAULT_CODE = `# Orbit Studio — Diagram-as-Code
# Type your architecture below

Frontend [icon: frontend]
Backend API [icon: backend, status: active]
PostgreSQL [icon: database]
Redis Cache [icon: cache]

Frontend -> Backend API: HTTP/REST
Backend API -> PostgreSQL: Store Data
Backend API -> Redis Cache: Cache Results

Group "AWS Cloud" {
  Backend API
  PostgreSQL
  Redis Cache
}
`;

export function DaCEditor() {
  const { setNodes, setEdges } = useCanvasStore();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleApply = useCallback(() => {
    const result = parseDSL(code);
    setParseResult(result);

    if (result.nodes.length > 0) {
      const laidOut = autoLayout(result.nodes, result.edges, { direction: 'TB' });
      setNodes(laidOut);
      setEdges(result.edges);
    }
  }, [code, setNodes, setEdges]);

  useEffect(() => {
    const handle = textareaRef.current;
    if (!handle) return;

    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleApply();
      }
    }

    handle.addEventListener('keydown', onKeyDown);
    return () => handle.removeEventListener('keydown', onKeyDown);
  }, [handleApply]);

  const lineCount = code.split('\n').length;

  return (
    <div className="flex h-full flex-col bg-card/60">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Diagram-as-Code
        </span>
        <button
          onClick={handleApply}
          className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200"
        >
          <Play className="h-3 w-3" />
          Render (⌘⏎)
        </button>
      </div>

      {parseResult && parseResult.errors.length > 0 && (
        <div className="border-b border-destructive/20 bg-destructive/5 px-3 py-1.5">
          <div className="flex items-center gap-1.5 text-[10px] text-destructive">
            <AlertCircle className="h-3 w-3" />
            <span className="font-medium">{parseResult.errors.length} parse error(s)</span>
          </div>
          {parseResult.errors.map((err, i) => (
            <p key={i} className="pl-5 text-[9px] text-destructive/70 font-mono">{err}</p>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="select-none border-r border-border px-2 py-3 text-right text-[11px] leading-[1.55] text-muted-foreground/30 font-mono bg-card/40">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 resize-none border-0 bg-transparent px-3 py-3 text-[11px] leading-[1.55] text-foreground font-mono outline-none placeholder:text-muted-foreground/30"
            placeholder="# Type your architecture DSL here..."
          />
        </div>
      </div>

      {parseResult && (
        <div className="border-t border-border px-3 py-1.5 text-[10px] text-muted-foreground">
          {parseResult.nodes.length} nodes, {parseResult.edges.length} edges
        </div>
      )}
    </div>
  );
}
