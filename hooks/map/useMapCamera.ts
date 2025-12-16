import { useMemo, useState } from 'react';

/**
 * Map camera and viewport state management
 * Consolidates viewport bounds and zoom level logic
 */

export interface MapCameraState {
  // Viewport bounds [minLon, minLat, maxLon, maxLat]
  viewportBounds: [number, number, number, number];
  // Zoom level
  zoomLevel: number;
  // Center coordinates [lon, lat]
  center: [number, number];
}

export interface MapCameraReturn extends MapCameraState {
  // State setters
  setViewportBounds: (bounds: [number, number, number, number]) => void;
  setZoomLevel: (zoom: number) => void;
  setCenter: (center: [number, number]) => void;
  // Computed
  bounds: [number, number, number, number];
}

const DEFAULT_HOME_COORDINATE: [number, number] = [9.26, 54.47926]; // Flensburg Harbor
const DEFAULT_ZOOM = 7;
const DEFAULT_BOUNDARIES = {
  ne: [49.869301, 71.185001] as [number, number],
  sw: [-31.266001, 27.560001] as [number, number],
};

export function useMapCamera(): MapCameraReturn {
  // Initial bounds (Europe focus)
  const [viewportBounds, setViewportBounds] = useState<[number, number, number, number]>([
    DEFAULT_BOUNDARIES.sw[0],
    DEFAULT_BOUNDARIES.sw[1],
    DEFAULT_BOUNDARIES.ne[0],
    DEFAULT_BOUNDARIES.ne[1],
  ]);

  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);
  const [center, setCenter] = useState<[number, number]>(DEFAULT_HOME_COORDINATE);

  // Compute bounds memo
  const bounds = useMemo(() => viewportBounds, [viewportBounds]);

  return {
    viewportBounds,
    setViewportBounds,
    zoomLevel,
    setZoomLevel,
    center,
    setCenter,
    bounds,
  };
}
