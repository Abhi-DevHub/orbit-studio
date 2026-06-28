'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Play, Building, ShoppingCart, Database, Brain, Globe, Shield } from 'lucide-react';

const TEMPLATES = [
  { id: 'netflix-clone', name: 'Netflix Clone', description: 'Video streaming platform with microservices', category: 'streaming', icon: Play, nodes: 9 },
  { id: 'saas-platform', name: 'SaaS Platform', description: 'Multi-tenant SaaS app with billing', category: 'saas', icon: Building, nodes: 10 },
  { id: 'e-commerce', name: 'E-Commerce', description: 'Full e-commerce with cart, orders, payments', category: 'ecommerce', icon: ShoppingCart, nodes: 11 },
  { id: 'healthcare', name: 'Healthcare Platform', description: 'HIPAA-compliant healthcare system', category: 'healthcare', icon: Shield, nodes: 14 },
  { id: 'banking-api', name: 'Banking API', description: 'Fintech API with transaction processing', category: 'fintech', icon: Database, nodes: 8 },
  { id: 'ai-chatbot', name: 'AI Chatbot Platform', description: 'LLM-powered chatbot architecture', category: 'ai', icon: Brain, nodes: 6 },
];

const CATEGORY_COLORS: Record<string, string> = {
  streaming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  saas: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  ecommerce: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  healthcare: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  fintech: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  ai: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center gap-2.5 border-b border-border px-5">
        <button
          onClick={() => router.push('/')}
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-sm font-medium">Architecture Templates</h1>
      </header>

      <main className="flex-1 overflow-auto">
        <motion.div
          className="mx-auto max-w-4xl p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-6" variants={cardVariants}>
            <h2 className="text-lg font-semibold tracking-tight">Start from a template</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose a pre-built architecture to get started quickly</p>
          </motion.div>

          <motion.div className="grid grid-cols-3 gap-3" variants={containerVariants}>
            {TEMPLATES.map((template) => (
              <motion.button
                key={template.id}
                variants={cardVariants}
                onClick={() => router.push(`/project/new?template=${template.id}`)}
                className="group rounded-lg border border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/30 hover:bg-secondary/40 cursor-pointer"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-secondary group-hover:bg-primary/10 transition-colors duration-200">
                  <template.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                </div>
                <h3 className="mb-0.5 text-sm font-medium">{template.name}</h3>
                <p className="mb-3 text-xs text-muted-foreground leading-relaxed">{template.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className={`rounded-full border px-2 py-0.5 ${CATEGORY_COLORS[template.category] || 'bg-secondary text-muted-foreground'}`}>
                    {template.category}
                  </span>
                  <span>{template.nodes} components</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
