import { Platform } from 'react-native';
import { useMedia } from 'tamagui';

/**
 * Hook to detect if the current platform is mobile web
 * Returns true when:
 * - Platform is web AND
 * - Viewport is smaller than medium breakpoint (mobile/tablet size)
 *
 * Returns false for:
 * - Native platforms (iOS/Android)
 * - Desktop web (large screens)
 */
export function useIsMobileWeb(): boolean {
  const media = useMedia();

  // Check if it's web platform
  const isWeb = Platform.OS === 'web';

  // Check if viewport is mobile size (not greater than medium)
  const isMobileViewport = !media.gtMd;

  // Return true only if both conditions are met
  return isWeb && isMobileViewport;
}

/**
 * Hook to detect if the current platform is mobile (web or native)
 * Returns true when:
 * - Platform is iOS OR
 * - Platform is Android OR
 * - Platform is web with mobile viewport (smaller than medium breakpoint)
 *
 * Returns false for:
 * - Desktop web (large screens)
 */
export function useIsMobile(): boolean {
  const media = useMedia();

  // Check if it's native platform (iOS or Android)
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

  // Check if it's web platform with mobile viewport
  const isMobileWeb = Platform.OS === 'web' && !media.gtMd;

  // Return true if either native or mobile web
  return isNative || isMobileWeb;
}
