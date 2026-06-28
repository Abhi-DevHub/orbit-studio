'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Play, Building, ShoppingCart } from 'lucide-react';

const TEMPLATES = [
  { id: 'netflix-clone', name: 'Netflix Clone', description: 'Video streaming platform with microservices', category: 'streaming', icon: Play, nodes: 9 },
  { id: 'saas-platform', name: 'SaaS Platform', description: 'Multi-tenant SaaS app with billing', category: 'saas', icon: Building, nodes: 10 },
  { id: 'e-commerce', name: 'E-Commerce', description: 'Full e-commerce with cart, orders, payments', category: 'ecommerce', icon: ShoppingCart, nodes: 11 },
  { id: 'healthcare', name: 'Healthcare Platform', description: 'HIPAA-compliant healthcare system', category: 'healthcare', icon: Sparkles, nodes: 14 },
  { id: 'banking-api', name: 'Banking API', description: 'Fintech API with transaction processing', category: 'fintech', icon: Sparkles, nodes: 8 },
  { id: 'ai-chatbot', name: 'AI Chatbot Platform', description: 'LLM-powered chatbot architecture', category: 'ai', icon: Sparkles, nodes: 6 },
];

export function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center gap-3 border-b border-border px-6">
        <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Architecture Templates</h1>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Start from a template</h2>
            <p className="text-muted-foreground">Choose a pre-built architecture to get started quickly</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => router.push(`/project/new?template=${template.id}`)}
                className="group rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:bg-secondary/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10">
                  <template.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold">{template.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{template.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2 py-0.5">{template.category}</span>
                  <span>{template.nodes} components</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
