'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Palette, Cpu } from 'lucide-react';
import { useUIStore } from '@/stores/ui-store';

const sectionVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.1 + i * 0.08 },
  }),
};

interface SettingsSection {
  icon: typeof User;
  label: string;
  items: { id: string; label: string; type: 'input' | 'select'; placeholder?: string; options?: string[]; value: string }[];
}

const SECTIONS: SettingsSection[] = [
  {
    icon: User,
    label: 'Profile',
    items: [
      { id: 'name', label: 'Name', type: 'input', placeholder: 'Your name', value: '' },
      { id: 'email', label: 'Email', type: 'input', placeholder: 'your@email.com', value: '' },
    ],
  },
  {
    icon: Palette,
    label: 'Appearance',
    items: [
      { id: 'theme', label: 'Theme', type: 'select', options: ['Light', 'Dark', 'System'], value: 'Light' },
    ],
  },
  {
    icon: Cpu,
    label: 'AI Provider',
    items: [
      { id: 'model', label: 'Default AI Model', type: 'select', options: ['Auto (recommended)', 'GPT-5', 'Gemini 2.5', 'Claude 4'], value: 'Auto (recommended)' },
    ],
  },
];

export function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useUIStore();

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
        <h1 className="text-sm font-medium">Settings</h1>
      </motion.header>

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-lg px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="mb-8"
          >
            <span className="inline-block rounded-full border border-border bg-secondary/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">
              Configuration
            </span>
            <h2 className="text-2xl font-semibold tracking-tight">Preferences</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Customize your workspace experience</p>
          </motion.div>

          <div className="space-y-2.5">
            {SECTIONS.map((section, i) => (
              <motion.div
                key={section.label}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary">
                    <section.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium">{section.label}</h3>
                </div>
                <div className="space-y-3.5">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{item.label}</label>
                      {item.type === 'input' ? (
                        <input
                          type="text"
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
                          placeholder={item.placeholder}
                          defaultValue={item.value}
                        />
                      ) : (
                        <select
                          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring/50 transition-colors duration-200"
                          value={item.id === 'theme' ? theme.charAt(0).toUpperCase() + theme.slice(1) : item.value}
                          onChange={(e) => {
                            if (item.id === 'theme') setTheme(e.target.value.toLowerCase() as any);
                          }}
                        >
                          {item.options?.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
