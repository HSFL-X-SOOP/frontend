import {useMemo} from 'react';
import {Plus, Home, Navigation, ZoomIn, ZoomOut, List, Filter} from '@tamagui/lucide-icons';
import {useTranslation} from '@/hooks/useTranslation';
import type {SpeedDialActionItem} from '@/types/speeddial';

/**
 * Configuration for map speed dial actions
 * Handles both native and web implementations
 */
interface MapSpeedDialActionsConfig {
    // UI state handlers
    setIsDrawerOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
    setIsFilterOpen: (value: boolean) => void;

    // Zoom handlers - platform-specific implementations
    onZoomIn: () => void | Promise<void>;
    onZoomOut: () => void | Promise<void>;

    // Camera/view handlers
    onResetView: () => void;
    onGoHome: () => void;
}

/**
 * Hook for managing map speed dial actions
 * Consolidates speed dial configuration from both Map.native and Map.web
 *
 * @param config - Configuration object with handlers for all speed dial actions
 * @returns Memoized array of speed dial action items
 *
 * @example
 * ```tsx
 * const speedDialActions = useMapSpeedDialActions({
 *     setIsDrawerOpen,
 *     setIsFilterOpen,
 *     onZoomIn: async () => { ... },
 *     onZoomOut: async () => { ... },
 *     onResetView: () => { ... },
 *     onGoHome: () => { ... },
 * });
 * ```
 */
export function useMapSpeedDialActions(
    config: MapSpeedDialActionsConfig
): SpeedDialActionItem[] {
    const {t} = useTranslation();

    const {
        setIsDrawerOpen,
        setIsFilterOpen,
        onZoomIn,
        onZoomOut,
        onResetView,
        onGoHome,
    } = config;

    return useMemo<SpeedDialActionItem[]>(
        () => [
            {
                key: 'sensors',
                label: t('navigation.sensors'),
                icon: List,
                onPress: () => {
                    setIsDrawerOpen(prev =>
                        typeof prev === 'boolean' ? !prev : prev
                    );
                },
            },
            {
                key: 'filter',
                label: t('map.filters'),
                icon: Filter,
                onPress: () => setIsFilterOpen(true),
            },
            {
                key: 'zoomin',
                label: 'Zoom In',
                icon: ZoomIn,
                closeOnPress: false,
                onPress: onZoomIn,
            },
            {
                key: 'zoomout',
                label: 'Zoom Out',
                icon: ZoomOut,
                closeOnPress: false,
                onPress: onZoomOut,
            },
            {
                key: 'compass',
                label: 'Reset View',
                icon: Navigation,
                closeOnPress: false,
                onPress: onResetView,
            },
            {
                key: 'home',
                label: 'Go Home',
                icon: Home,
                closeOnPress: false,
                onPress: onGoHome,
            },
        ],
        [t, setIsDrawerOpen, setIsFilterOpen, onZoomIn, onZoomOut, onResetView, onGoHome]
    );
}
