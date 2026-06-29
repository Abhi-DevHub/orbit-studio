'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Github, Chrome, Mail } from 'lucide-react';
import { GeistSans } from 'geist/font/sans';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex items-center px-4 h-12">
        <button onClick={() => router.push('/')} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200">
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-lg font-semibold text-foreground">Welcome back</h1>
            <p className="mt-1 text-xs text-muted-foreground">Sign in to Orbit Studio to continue your work</p>
          </div>

          <div className="space-y-3">
            <button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-all duration-200">
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
            <button className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary transition-all duration-200">
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:border-ring/50 transition-colors duration-200 placeholder:text-muted-foreground/40"
              />
            </div>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200">
              <Mail className="h-3.5 w-3.5" />
              Sign in with Email
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button onClick={() => router.push('/sign-up')} className="text-primary hover:underline">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
