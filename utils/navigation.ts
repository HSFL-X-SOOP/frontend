import { Platform } from 'react-native';
import type { Href } from 'expo-router';

/**
 * Platform-specific route helpers
 * - Web: Uses original route groups (auth), (profile), etc.
 * - Native: Uses (tabs) routes to maintain persistent header/tab-bar
 */

type AuthScreen = 'login' | 'register' | 'magic-link' | 'oauth-callback' | 'reset-password' | 'verify-email';
type ProfileScreen = 'profile' | 'create-profile';

export function getAuthRoute(screen: AuthScreen): Href {
    if (Platform.OS === 'web') {
        return `/(auth)/${screen}` as Href;
    }

    // Only login/register exist inside the (tabs) group; other auth flows stay in (auth)
    if (screen === 'login' || screen === 'register') {
        return `/(tabs)/${screen}` as Href;
    }

    return `/(auth)/${screen}` as Href;
}

export function getProfileRoute(screen: ProfileScreen): Href {
    if (Platform.OS === 'web') {
        return `/(profile)/${screen}` as Href;
    }
    return `/(tabs)/${screen === 'profile' ? 'profile-detail' : screen}` as Href;
}

export function getMapRoute(): Href {
    // Native uses tabs with the map at the root (index)
    return '/' as Href;
}
