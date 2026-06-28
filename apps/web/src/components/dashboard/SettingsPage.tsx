'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Palette, Code, Bell } from 'lucide-react';

export function SettingsPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center gap-3 border-b border-border px-6">
        <button onClick={() => router.push('/')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Name</label>
                <input type="text" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Email</label>
                <input type="email" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" placeholder="your@email.com" />
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <select className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-ring">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <Code className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Provider</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">Default AI Model</label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring">
                  <option>Auto (recommended)</option>
                  <option>GPT-5</option>
                  <option>Gemini 2.5</option>
                  <option>Claude 4</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
