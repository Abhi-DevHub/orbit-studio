'use client';

import { useParams } from 'next/navigation';
import { WorkspacePage } from '@/components/project/WorkspacePage';

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  return <WorkspacePage projectId={params.id} />;
}
