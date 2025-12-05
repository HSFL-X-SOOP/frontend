import React, { Suspense, lazy } from 'react';
import { LazyLoadFallback } from '@/components/common/LazyLoadFallback';

/**
 * Lazy-loaded Marina Dashboard Screen
 * This wrapper splits the large dashboard component (1023 lines)
 * into a separate chunk, improving initial load time
 */
const MarinaScreenContent = lazy(() => import('./MarinaScreenContent'));

export default function MarinaDashboard() {
  return (
    <Suspense fallback={<LazyLoadFallback message="Loading dashboard..." />}>
      <MarinaScreenContent />
    </Suspense>
  );
}
