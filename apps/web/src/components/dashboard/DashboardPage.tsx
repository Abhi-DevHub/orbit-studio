'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  LayoutTemplate,
  Clock,
  ArrowRight,
  Sparkles,
  Upload,
  LayoutDashboard,
  Settings,
  ChevronRight,
  FileText,
  Layers,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const MOCK_PROJECTS = [
  { id: '1', name: 'Healthcare SaaS Platform', description: 'Multi-tenant healthcare platform with AI diagnostics', updatedAt: '2026-06-28T10:00:00Z', nodeCount: 12 },
  { id: '2', name: 'Netflix Clone', description: 'Video streaming platform with microservices', updatedAt: '2026-06-27T15:30:00Z', nodeCount: 9 },
  { id: '3', name: 'Banking API', description: 'Fintech API with transaction processing', updatedAt: '2026-06-26T09:00:00Z', nodeCount: 7 },
  { id: '4', name: 'Real-time Chat App', description: 'WebSocket-based messaging platform', updatedAt: '2026-06-25T14:00:00Z', nodeCount: 5 },
];

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, active: true },
  { label: 'Templates', href: '/templates', icon: LayoutTemplate, active: false },
  { label: 'Settings', href: '/settings', icon: Settings, active: false },
];

const QUICK_ACTIONS = [
  { label: 'New from Template', icon: LayoutTemplate, desc: 'Start with a pre-built architecture', action: 'router' as const, href: '/templates' },
  { label: 'AI Architect', icon: Sparkles, desc: 'Describe your system, AI builds it', action: 'dialog' as const },
  { label: 'Import Architecture', icon: Upload, desc: 'Import from existing project', action: 'none' as const },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export function DashboardPage() {
  const router = useRouter();
  const [showNewProject, setShowNewProject] = useState(false);
  const [projectName, setProjectName] = useState('');

  function handleCreateProject() {
    if (!projectName.trim()) return;
    router.push(`/project/new?name=${encodeURIComponent(projectName)}`);
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors duration-150 cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 border-r border-border p-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors duration-150',
                item.active
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
              )}
            >
              <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
              {item.label}
            </a>
          ))}
        </aside>

        <main className="flex-1 overflow-auto">
          <motion.div
            className="mx-auto max-w-4xl p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-8 flex items-center justify-between" variants={itemVariants}>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your architecture projects</p>
              </div>
              <button
                onClick={() => setShowNewProject(true)}
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                New Project
              </button>
            </motion.div>

            <AnimatePresence>
              {showNewProject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="rounded-lg border border-border bg-card p-3">
                    <h3 className="mb-2 text-xs font-medium">Create New Project</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Project name..."
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                        autoFocus
                      />
                      <button
                        onClick={handleCreateProject}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-150 cursor-pointer"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewProject(false)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors duration-150 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div className="mb-8 grid grid-cols-3 gap-3" variants={itemVariants}>
              {QUICK_ACTIONS.map((action, i) => (
                <motion.button
                  key={action.label}
                  custom={i}
                  variants={buttonVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => action.action === 'router' && action.href ? router.push(action.href) : action.action === 'dialog' ? setShowNewProject(true) : undefined}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-primary/30 hover:bg-secondary/50 cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary group-hover:bg-primary/10 transition-colors duration-200">
                    <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{action.label}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{action.desc}</div>
                  </div>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors duration-200 flex-shrink-0" />
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium">Recent Projects</h2>
                <button className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors duration-150 cursor-pointer">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {MOCK_PROJECTS.map((project, i) => (
                  <motion.button
                    key={project.id}
                    custom={i}
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    onClick={() => router.push(`/project/${project.id}`)}
                    className="group w-full rounded-lg border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-primary/20 hover:bg-secondary/30 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium truncate">{project.name}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {project.nodeCount} components
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(project.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
