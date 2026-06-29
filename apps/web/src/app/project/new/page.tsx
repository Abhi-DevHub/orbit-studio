'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewProjectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const name = searchParams.get('name') || 'Untitled Project';
    const id = `proj_${Date.now()}`;
    router.replace(`/project/${id}?name=${encodeURIComponent(name)}`);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-xs text-muted-foreground">Creating project...</p>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">Creating project...</p>
        </div>
      }>
        <NewProjectInner />
      </Suspense>
    </div>
  );
}
