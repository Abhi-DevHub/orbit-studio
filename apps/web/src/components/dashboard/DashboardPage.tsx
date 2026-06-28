'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LayoutTemplate, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

const MOCK_PROJECTS = [
  { id: '1', name: 'Healthcare SaaS Platform', description: 'Multi-tenant healthcare platform with AI diagnostics', updatedAt: '2026-06-28T10:00:00Z', nodeCount: 12 },
  { id: '2', name: 'Netflix Clone', description: 'Video streaming platform with microservices', updatedAt: '2026-06-27T15:30:00Z', nodeCount: 9 },
  { id: '3', name: 'Banking API', description: 'Fintech API with transaction processing', updatedAt: '2026-06-26T09:00:00Z', nodeCount: 7 },
  { id: '4', name: 'Real-time Chat App', description: 'WebSocket-based messaging platform', updatedAt: '2026-06-25T14:00:00Z', nodeCount: 5 },
];

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
      {/* Top Navigation */}
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">{APP_NAME}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Sign In
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-border p-4">
          <nav className="space-y-1">
            {[
              { label: 'Dashboard', href: '/', icon: LayoutDashboardIcon, active: true },
              { label: 'Templates', href: '/templates', icon: LayoutTemplate, active: false },
              { label: 'Settings', href: '/settings', icon: SettingsIcon, active: false },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                  item.active
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your architecture projects</p>
              </div>
              <button
                onClick={() => setShowNewProject(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                New Project
              </button>
            </div>

            {/* New Project Dialog */}
            {showNewProject && (
              <div className="mb-6 rounded-lg border border-border bg-card p-4">
                <h3 className="mb-3 text-sm font-medium">Create New Project</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Project name..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                  <button
                    onClick={handleCreateProject}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewProject(false)}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { label: 'New from Template', icon: LayoutTemplate, action: () => router.push('/templates') },
                { label: 'AI Architect', icon: Sparkles, action: () => setShowNewProject(true) },
                { label: 'Import Architecture', icon: UploadIcon, action: () => {} },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">Get started quickly</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Projects */}
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Projects</h2>
                <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-3">
                {MOCK_PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => router.push(`/project/${project.id}`)}
                    className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{project.nodeCount} components</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(project.updatedAt)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function LayoutDashboardIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

function SettingsIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UploadIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
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
