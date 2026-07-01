'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot, User, Cpu, Database, Globe, Shield, Zap, Code, Copy, Check } from 'lucide-react';
import { useAIStore } from '@/stores/ai-store';
import { useUIStore } from '@/stores/ui-store';
import type { LucideIcon } from 'lucide-react';

const AGENT_ICONS: Record<string, LucideIcon> = {
  Planner: Cpu,
  Requirements: Database,
  Architect: Cpu,
  Database: Database,
  API: Globe,
  Infrastructure: Globe,
  Security: Shield,
  Reviewer: Zap,
};

export function AIChatPanel() {
  const { messages, isGenerating, pipelineStatus, suggestions, generatedDSL, addMessage, runPipeline } = useAIStore();
  const { setWorkspaceMode } = useUIStore();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  function handleSend() {
    if (!input.trim() || isGenerating) return;
    addMessage({ id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() });
    setInput('');
    runPipeline();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">AI Architecture Assistant</p>
            <p className="mt-1 text-[10px] text-muted-foreground/60 max-w-[180px]">Describe what you want to build, and I will help design the architecture</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${msg.role === 'user' ? 'bg-primary/10' : msg.role === 'system' ? 'bg-amber-500/10' : 'bg-secondary'}`}>
                {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-primary" /> : <Bot className="h-3.5 w-3.5 text-muted-foreground" />}
              </div>
              <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[80%] ${msg.role === 'user' ? 'bg-primary/10 text-foreground' : 'bg-secondary/50 text-muted-foreground'}`}>
                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {pipelineStatus.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Agent Pipeline</span>
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {pipelineStatus.map((agent) => {
                  const Icon = AGENT_ICONS[agent.name] || Bot;
                  const isActive = agent.status === 'running';
                  const isDone = agent.status === 'completed';
                  const isError = agent.status === 'error';
                  return (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]"
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded ${isActive ? 'bg-primary/20 text-primary' : isDone ? 'bg-emerald-500/20 text-emerald-500' : isError ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="flex-1 capitalize text-muted-foreground">{agent.name}</span>
                      {isActive && (
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-[10px] text-primary"
                        >
                          Processing...
                        </motion.span>
                      )}
                      {isDone && <span className="text-[10px] text-emerald-500">Done</span>}
                      {isError && <span className="text-[10px] text-destructive">Error</span>}
                      {agent.status === 'pending' && <span className="text-[10px] text-muted-foreground/40">Waiting</span>}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Suggestions</div>
            <div className="space-y-1.5">
              {suggestions.map((s) => (
                <div key={s.id} className="rounded-lg border border-border bg-background p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.type === 'optimization' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                    <span className="text-[11px] font-medium text-foreground">{s.title}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedDSL && (
          <div className="rounded-xl border border-border bg-card p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Generated DSL</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => { navigator.clipboard.writeText(generatedDSL); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => setWorkspaceMode('dac')}
                  className="flex items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <Code className="h-3 w-3" />
                  DaC
                </button>
              </div>
            </div>
            <pre className="max-h-32 overflow-y-auto rounded-lg bg-background p-2.5 text-[9px] leading-relaxed text-muted-foreground font-mono border border-border whitespace-pre-wrap">{generatedDSL}</pre>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {['Design a chat app', 'Microservices', 'Add auth'].map((s) => (
            <button
              key={s}
              onClick={() => {
                if (isGenerating) return;
                addMessage({ id: Date.now().toString(), role: 'user', content: s, timestamp: new Date() });
                runPipeline();
              }}
              disabled={isGenerating}
              className="rounded-md border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 transition-all duration-200"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Describe your architecture..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isGenerating}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring/50 disabled:opacity-40 transition-colors duration-200 placeholder:text-muted-foreground/40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="flex items-center justify-center rounded-lg bg-primary px-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all duration-200"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
