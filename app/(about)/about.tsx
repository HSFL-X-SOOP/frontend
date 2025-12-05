import React, { Suspense, lazy } from 'react';
import { LazyLoadFallback } from '@/components/common/LazyLoadFallback';

/**
 * Lazy-loaded About Screen
 * This wrapper splits the large about component (321 lines)
 * into a separate chunk, improving initial load time
 */
const AboutScreenContent = lazy(() => import('./AboutContent'));

export default function AboutScreen() {
  return (
    <Suspense fallback={<LazyLoadFallback message="Loading about..." />}>
      <AboutScreenContent />
    </Suspense>
  );
}
