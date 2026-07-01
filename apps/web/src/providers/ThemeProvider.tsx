'use client';

import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/ui-store';

const STORAGE_KEY = 'orbit-theme';

function resolveTheme(preference: string): 'light' | 'dark' {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return preference as 'light' | 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useUIStore();

  const applyTheme = useCallback((pref: string) => {
    const resolved = resolveTheme(pref);
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) || 'light';
    setTheme(stored as 'light' | 'dark' | 'system');
    applyTheme(stored);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, applyTheme]);

  return <>{children}</>;
}
