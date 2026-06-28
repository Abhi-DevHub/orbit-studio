'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { WorkspacePage } from '@/components/project/WorkspacePage';

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const template = searchParams.get('template') || undefined;

  return <WorkspacePage projectId={params.id} templateId={template} />;
}
