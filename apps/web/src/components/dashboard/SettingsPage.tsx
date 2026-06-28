'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Palette, Code, Bell } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function SettingsPage() {
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
        <h1 className="text-sm font-medium">Settings</h1>
      </header>

      <main className="flex-1 overflow-auto">
        <motion.div
          className="mx-auto max-w-lg p-6 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.section className="rounded-lg border border-border bg-card p-4" variants={sectionVariants}>
            <div className="mb-3 flex items-center gap-2.5">
              <User className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Profile</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Name</label>
                <input
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 placeholder:text-muted-foreground/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </motion.section>

          <motion.section className="rounded-lg border border-border bg-card p-4" variants={sectionVariants}>
            <div className="mb-3 flex items-center gap-2.5">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Theme</span>
              <select className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 cursor-pointer">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>
          </motion.section>

          <motion.section className="rounded-lg border border-border bg-card p-4" variants={sectionVariants}>
            <div className="mb-3 flex items-center gap-2.5">
              <Code className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-medium">AI Provider</h2>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Default AI Model</label>
              <select className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs outline-none focus:border-ring transition-colors duration-150 cursor-pointer">
                <option>Auto (recommended)</option>
                <option>GPT-5</option>
                <option>Gemini 2.5</option>
                <option>Claude 4</option>
              </select>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
