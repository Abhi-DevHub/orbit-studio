'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/components/dashboard/DashboardPage';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Auth check will go here
  }, [router]);

  return <DashboardPage />;
}
