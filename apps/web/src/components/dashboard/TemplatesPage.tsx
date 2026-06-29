'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Building, ShoppingCart, Shield, Database, Brain } from 'lucide-react';

const TEMPLATES = [
  { id: 'netflix-clone', name: 'Netflix Clone', description: 'Video streaming platform with microservices architecture', category: 'streaming', icon: Play, nodes: 13 },
  { id: 'saas-platform', name: 'SaaS Platform', description: 'Multi-tenant SaaS application with billing and analytics', category: 'saas', icon: Building, nodes: 12 },
  { id: 'e-commerce', name: 'E-Commerce Platform', description: 'Full e-commerce with cart, orders, and payment processing', category: 'ecommerce', icon: ShoppingCart, nodes: 12 },
  { id: 'healthcare', name: 'Healthcare Platform', description: 'HIPAA-compliant healthcare system with EHR', category: 'healthcare', icon: Shield, nodes: 13 },
  { id: 'banking-api', name: 'Banking API', description: 'Fintech API with transaction processing and fraud detection', category: 'fintech', icon: Database, nodes: 12 },
  { id: 'ai-chatbot', name: 'AI Chatbot Platform', description: 'LLM-powered chatbot with vector search and context management', category: 'ai', icon: Brain, nodes: 12 },
];

const CATEGORY_STYLES: Record<string, { dot: string; bg: string; border: string }> = {
  streaming: { dot: 'bg-blue-500', bg: 'bg-blue-500/8', border: 'border-blue-500/20' },
  saas: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20' },
  ecommerce: { dot: 'bg-amber-500', bg: 'bg-amber-500/8', border: 'border-amber-500/20' },
  healthcare: { dot: 'bg-rose-500', bg: 'bg-rose-500/8', border: 'border-rose-500/20' },
  fintech: { dot: 'bg-violet-500', bg: 'bg-violet-500/8', border: 'border-violet-500/20' },
  ai: { dot: 'bg-cyan-500', bg: 'bg-cyan-500/8', border: 'border-cyan-500/20' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
  },
};

export function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh flex-col">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="flex h-12 items-center gap-3 border-b border-border px-5"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>
        <h1 className="text-sm font-medium">Architecture Templates</h1>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-auto"
      >
        <div className="mx-auto max-w-5xl px-6 py-10">
          <motion.div variants={cardVariants} className="mb-10">
            <span className="inline-block rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">
              Templates
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">Start from a template</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Choose a pre-built architecture to get started quickly</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-3"
            variants={containerVariants}
          >
            {TEMPLATES.map((template) => {
              const style = CATEGORY_STYLES[template.category] || { dot: 'bg-gray-500', bg: 'bg-gray-500/8', border: 'border-gray-500/20' };
              return (
                <motion.button
                  key={template.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/project/new?template=${template.id}`)}
                  className="group relative rounded-xl border border-border bg-card p-5 text-left transition-all duration-200 hover:border-primary/20 overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                    background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(196 100% 50% / 0.03), transparent 40%)'
                  }} />
                  <div className={`mb-3.5 inline-flex h-9 w-9 items-center justify-center rounded-lg ${style.bg} border ${style.border} group-hover:border-primary/30 transition-colors duration-200`}>
                    <template.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <h3 className="text-sm font-medium mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{template.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 ${style.bg} ${style.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {template.category}
                    </span>
                    <span>{template.nodes} components</span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
