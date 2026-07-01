import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Orbit Studio — AI-Native Software Architecture Platform',
  description: 'Design, simulate, build, and deploy complete software systems with AI-powered architecture design.',
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('orbit-theme') || 'light';
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var r = t === 'system' ? (d ? 'dark' : 'light') : t;
      document.documentElement.classList.add(r);
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
