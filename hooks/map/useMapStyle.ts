import { useMemo } from 'react';

/**
 * Map style management based on theme
 * Returns appropriate map style JSON based on dark/light theme
 */

export interface MapStyleReturn {
  mapStyle: any; // MapLibre style object
}

export function useMapStyle(isDark: boolean): MapStyleReturn {
  const mapStyle = useMemo(
    () =>
      isDark
        ? require('@/assets/mapStyles/dark_mode_new.json')
        : require('@/assets/mapStyles/light_mode_new.json'),
    [isDark]
  );

  return { mapStyle };
}
