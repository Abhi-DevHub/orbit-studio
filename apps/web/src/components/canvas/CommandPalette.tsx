'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Layout, Code, FileText, Download, Image, FileJson, FileType,
  LayoutTemplate, Sparkles, Undo2, Redo2, Save, PanelRightClose, PanelRightOpen, Keyboard,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import { useCanvasStore } from '@/stores/canvas-store';
import { dispatch, ORBIT_EVENTS } from '@/lib/events';

interface Command {
  id: string;
  label: string;
  description: string;
  icon: typeof Search;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, toggleCommandPalette, workspaceMode, setWorkspaceMode, sidebarOpen, toggleSidebar, rightPanelOpen, toggleRightPanel } = useUIStore();
  const { undo, redo } = useCanvasStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    { id: 'auto-layout', label: 'Auto Layout', description: 'Arrange all nodes with equal spacing', icon: Layout, shortcut: '⌘⇧L', action: () => dispatch(ORBIT_EVENTS.AUTO_LAYOUT) },
    { id: 'mode-canvas', label: 'Canvas Mode', description: 'Switch to canvas workspace', icon: Layout, action: () => setWorkspaceMode('canvas') },
    { id: 'mode-dac', label: 'Diagram-as-Code Mode', description: 'Split-pane code + canvas', icon: Code, action: () => setWorkspaceMode('dac') },
    { id: 'mode-docs', label: 'Docs Mode', description: 'Documentation + canvas view', icon: FileText, action: () => setWorkspaceMode('docs') },
    { id: 'ai-architect', label: 'AI Architect', description: 'Open the AI architecture assistant', icon: Sparkles, action: () => { setWorkspaceMode('canvas') } },
    { id: 'templates', label: 'Browse Templates', description: 'Open template gallery', icon: LayoutTemplate, action: () => { router.push('/templates'); toggleCommandPalette(); } },
    { id: 'export-png', label: 'Export PNG', description: 'Export canvas as PNG image', icon: Image, action: () => dispatch(ORBIT_EVENTS.EXPORT_PNG) },
    { id: 'export-svg', label: 'Export SVG', description: 'Export canvas as SVG', icon: FileType, action: () => dispatch(ORBIT_EVENTS.EXPORT_SVG) },
    { id: 'export-json', label: 'Export JSON', description: 'Export canvas data as JSON', icon: FileJson, action: () => dispatch(ORBIT_EVENTS.EXPORT_JSON) },
    { id: 'undo', label: 'Undo', description: 'Undo last action', icon: Undo2, shortcut: '⌘Z', action: () => { undo(); toggleCommandPalette(); } },
    { id: 'redo', label: 'Redo', description: 'Redo last undone action', icon: Redo2, shortcut: '⌘⇧Z', action: () => { redo(); toggleCommandPalette(); } },
    { id: 'save', label: 'Save', description: 'Save current project', icon: Save, shortcut: '⌘S', action: () => dispatch(ORBIT_EVENTS.SAVE) },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', description: 'Show or hide the sidebar', icon: PanelRightClose, shortcut: '⌘B', action: () => { toggleSidebar(); toggleCommandPalette(); } },
    { id: 'toggle-panel', label: 'Toggle Right Panel', description: 'Show or hide the right panel', icon: PanelRightOpen, shortcut: '⌘E', action: () => { toggleRightPanel(); toggleCommandPalette(); } },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', icon: Keyboard, shortcut: '⌘/', action: () => { toggleCommandPalette(); } },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleCommandPalette]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const filtered = query
    ? commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const handleSelect = useCallback((cmd: Command) => {
    cmd.action();
    toggleCommandPalette();
  }, [toggleCommandPalette]);

  if (!commandPaletteOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={toggleCommandPalette} />
      <div className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 border-0 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/40"
          />
          <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">esc</span>
        </div>
        <div className="max-h-72 overflow-y-auto p-1.5">
          {filtered.length === 0 && (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
              No commands found for &ldquo;{query}&rdquo;
            </div>
          )}
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => handleSelect(cmd)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all duration-150 hover:bg-secondary"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                <cmd.icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground">{cmd.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">{cmd.description}</div>
              </div>
              {cmd.shortcut && (
                <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground font-mono">{cmd.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
