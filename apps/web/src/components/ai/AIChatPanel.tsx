'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, StopCircle } from 'lucide-react';
import { useAIStore } from '@/stores/ai-store';
import { useCanvasStore } from '@/stores/canvas-store';

const AGENT_NAMES = ['Planner', 'Requirements', 'Architect', 'Database', 'API', 'Infrastructure', 'Security', 'Reviewer'];

export function AIChatPanel() {
  const [input, setInput] = useState('');
  const { messages, isGenerating, pipelineStatus, addMessage, setIsGenerating, setPipelineStatus, updateAgentStatus } = useAIStore();
  const { nodes, edges } = useCanvasStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pipelineStatus]);

  async function handleSubmit() {
    if (!input.trim() || isGenerating) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setInput('');
    setIsGenerating(true);

    // Simulate AI pipeline
    setPipelineStatus(AGENT_NAMES.map((name) => ({ name, status: 'pending' as const })));

    for (const name of AGENT_NAMES) {
      updateAgentStatus(name, 'running');
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
      updateAgentStatus(name, 'completed');
    }

    // Simulate AI response
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant' as const,
      content: generateMockResponse(userMessage.content, nodes.length),
      timestamp: new Date(),
    };
    addMessage(aiMessage);
    setIsGenerating(false);
    setPipelineStatus([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Agent Pipeline Status */}
      {pipelineStatus.length > 0 && (
        <div className="border-b border-border p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            AI Agents Working...
          </div>
          <div className="space-y-1">
            {pipelineStatus.map((agent) => (
              <div key={agent.name} className="flex items-center gap-2 text-xs">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    agent.status === 'completed' ? 'bg-accent' :
                    agent.status === 'running' ? 'bg-primary animate-pulse' :
                    agent.status === 'error' ? 'bg-destructive' :
                    'bg-muted'
                  }`}
                />
                <span className={agent.status === 'completed' ? 'text-accent' : 'text-muted-foreground'}>
                  {agent.name}
                </span>
                {agent.status === 'running' && (
                  <span className="text-[10px] text-primary">processing...</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-sm font-medium">AI Architecture Copilot</h3>
            <p className="mb-4 max-w-[200px] text-xs text-muted-foreground">
              Ask me anything about your architecture
            </p>
            <div className="space-y-2">
              {[
                'Add Redis cache layer',
                'Scale to 10M users',
                'Analyze for bottlenecks',
                'Estimate monthly costs',
                'Review security',
                'Generate documentation',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    inputRef.current?.focus();
                  }}
                  className="block w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-left text-xs text-muted-foreground hover:bg-secondary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`mb-3 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <div
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI about your architecture..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring"
          />
          {isGenerating ? (
            <button className="rounded-lg bg-destructive p-2 text-destructive-foreground">
              <StopCircle className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="rounded-lg bg-primary p-2 text-primary-foreground disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function generateMockResponse(userInput: string, nodeCount: number): string {
  const lower = userInput.toLowerCase();
  if (lower.includes('redis') || lower.includes('cache')) {
    return 'I\'ve analyzed your architecture and identified that adding Redis between the API Gateway and Database would reduce read latency by ~80%. Estimated monthly cost: $15/month for a cache.t3.micro instance. Would you like me to add it to your canvas?';
  }
  if (lower.includes('scale') || lower.includes('million')) {
    return 'To scale to 10M users, I recommend:\n1. Add read replicas to PostgreSQL\n2. Implement Redis caching layer\n3. Add CDN for static assets\n4. Use horizontal scaling for API services\n5. Implement message queue for async tasks\nEstimated infrastructure cost: ~$2,500/month';
  }
  if (lower.includes('cost') || lower.includes('estimate') || lower.includes('price')) {
    return `Based on your current architecture with ${nodeCount} components:\n- Compute: ~$150/month\n- Database: ~$40/month\n- Cache: ~$15/month\n- Storage: ~$10/month\n- Network: ~$25/month\n- Total: ~$240/month`;
  }
  if (lower.includes('security') || lower.includes('review') || lower.includes('vulnerability')) {
    return 'Security Review Results:\n✅ Authentication: JWT with OAuth\n✅ HTTPS enabled\n⚠️ Missing rate limiting on API endpoints (Medium)\n⚠️ No encryption at rest for sensitive data (Medium)\n⚠️ Missing WAF (Web Application Firewall)\nScore: 72/100\nRecommendations: Add rate limiting, enable encryption at rest, deploy WAF.';
  }
  if (lower.includes('explain') || lower.includes('what is')) {
    return `Looking at this component, it's designed to handle ${nodeCount > 5 ? 'distributed processing across multiple services' : 'focused functionality'}. Common patterns include event-driven architecture for scalability and caching for performance. Consider using managed cloud services for production deployments.`;
  }
  if (lower.includes('documentation') || lower.includes('doc')) {
    return 'I can generate comprehensive documentation for your architecture including:\n1. System Overview\n2. Architecture Decision Records\n3. API Reference\n4. Database Schema\n5. Deployment Guide\n6. Security & Compliance\nWhich format would you like? (Markdown, HTML, PDF)';
  }
  return `I've analyzed your architecture with ${nodeCount} components. Here are my observations:\n\n✅ Well-structured service boundaries\n✅ Clear separation of concerns\n⚠️ Consider adding monitoring and observability\n💡 Add centralized logging for better debugging\n\nWould you like me to dive deeper into any specific area?`;
}
