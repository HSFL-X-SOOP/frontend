import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to get the dynamic viewport height on mobile web browsers
 * Accounts for browser UI elements (address bar, navigation bar)
 *
 * Returns:
 * - viewportHeight: The actual available viewport height in pixels
 * - viewportUnit: A custom unit that represents 1% of the viewport height
 * - safeBottomOffset: The amount of space taken by browser UI at the bottom
 */
export function useViewportHeight() {
  const [viewportHeight, setViewportHeight] = useState(
    Platform.OS === 'web' ? window.innerHeight : 0
  );
  const [safeBottomOffset, setSafeBottomOffset] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const updateViewportHeight = () => {
      // Get the actual viewport height
      const vh = window.visualViewport?.height || window.innerHeight;
      setViewportHeight(vh);

      // Calculate the bottom offset (difference between window height and viewport)
      // This represents space taken by browser UI elements
      const offset = window.innerHeight - vh;
      setSafeBottomOffset(Math.max(0, offset));

      // Also update CSS custom properties for use in stylesheets
      const root = document.documentElement;
      root.style.setProperty('--vh', `${vh * 0.01}px`);
      root.style.setProperty('--safe-bottom', `${Math.max(0, offset)}px`);
    };

    // Initial measurement
    updateViewportHeight();

    // Listen for viewport changes
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Also listen for focus events which might trigger keyboard
    const handleFocus = () => {
      setTimeout(updateViewportHeight, 100);
    };
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleFocus);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', updateViewportHeight);
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleFocus);
    };
  }, []);

  return {
    viewportHeight,
    viewportUnit: viewportHeight * 0.01, // 1vh equivalent
    safeBottomOffset,
  };
}

/**
 * Calculates actual height value accounting for browser UI
 * @param percentage - Percentage of viewport height (0-100)
 * @param offset - Additional offset to subtract (optional)
 */
export function calculateSafeHeight(percentage: number, offset = 0): string {
  if (Platform.OS !== 'web') {
    return `${percentage}%`;
  }

  // Use CSS calc with custom properties
  return `calc(${percentage} * var(--vh, 1vh) - ${offset}px)`;
}