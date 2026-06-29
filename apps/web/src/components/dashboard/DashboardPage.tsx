'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutTemplate, Sparkles, Clock, ArrowRight, Upload, PanelRightClose, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const MOCK_PROJECTS = [
  { id: '1', name: 'Healthcare SaaS Platform', description: 'Multi-tenant healthcare platform with AI diagnostics', updatedAt: '2026-06-28T10:00:00Z', nodeCount: 12 },
  { id: '2', name: 'Netflix Clone', description: 'Video streaming platform with microservices', updatedAt: '2026-06-27T15:30:00Z', nodeCount: 9 },
  { id: '3', name: 'Banking API', description: 'Fintech API with transaction processing', updatedAt: '2026-06-26T09:00:00Z', nodeCount: 7 },
  { id: '4', name: 'Real-time Chat App', description: 'WebSocket-based messaging platform', updatedAt: '2026-06-25T14:00:00Z', nodeCount: 5 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
  },
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
    <div className="flex min-h-dvh flex-col">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="flex h-12 items-center justify-between border-b border-border px-5"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium tracking-tight">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
            Sign In
          </button>
        </div>
      </motion.header>

      <div className="flex flex-1 overflow-hidden">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
          className="w-48 border-r border-border p-3 hidden md:flex flex-col"
        >
          <nav className="space-y-0.5">
            {[
              { label: 'Dashboard', href: '/', icon: PanelRightClose, active: true },
              { label: 'Templates', href: '/templates', icon: LayoutTemplate, active: false },
              { label: 'Settings', href: '/settings', icon: Settings, active: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-all duration-200',
                  item.active
                    ? 'bg-secondary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </nav>
        </motion.aside>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 overflow-auto"
        >
          <div className="mx-auto max-w-4xl px-6 py-10">
            <motion.div variants={itemVariants} className="mb-10">
              <span className="inline-block rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">
                Workspace
              </span>
              <div className="flex items-end justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">Your projects</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">Manage and design your system architectures</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewProject(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Project
                </motion.button>
              </div>
            </motion.div>

            <AnimatePresence>
              {showNewProject && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="mb-6 rounded-xl border border-border bg-card p-4"
                >
                  <h3 className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Create new project</h3>
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      placeholder="Project name..."
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                      autoFocus
                    />
                    <button
                      onClick={handleCreateProject}
                      className="rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => setShowNewProject(false)}
                      className="rounded-lg border border-border px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="mb-10 grid grid-cols-3 gap-2.5">
              {[
                { label: 'From Template', icon: LayoutTemplate, action: () => router.push('/templates'), desc: 'Pre-built architectures' },
                { label: 'AI Architect', icon: Sparkles, action: () => setShowNewProject(true), desc: 'Describe what you need' },
                { label: 'Import', icon: Upload, action: () => {}, desc: 'JSON / YAML file' },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="group rounded-xl border border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/20 hover:bg-secondary/30"
                >
                  <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors duration-200">
                    <action.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="text-xs font-medium mb-0.5">{action.label}</div>
                  <div className="text-[10px] text-muted-foreground">{action.desc}</div>
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-medium">Recent projects</h2>
                <button className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors duration-200">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-2">
                {MOCK_PROJECTS.map((project, i) => (
                  <motion.button
                    key={project.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1], delay: 0.3 + i * 0.06 }}
                    whileHover={{ scale: 1.005, x: 2 }}
                    whileTap={{ scale: 0.995 }}
                    onClick={() => router.push(`/project/${project.id}`)}
                    className="w-full rounded-xl border border-border bg-card p-3.5 text-left transition-all duration-200 hover:border-primary/20 hover:bg-secondary/30 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium truncate">{project.name}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground shrink-0 ml-4">
                        <span className="hidden sm:inline">{project.nodeCount} components</span>
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
          </div>
        </motion.main>
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
