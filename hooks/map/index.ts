/**
 * Map-related hooks
 * Consolidated map logic to reduce duplication between native and web implementations
 */

export { useMapFilters, type MapFiltersReturn } from './useMapFilters';
export { useMapCamera, type MapCameraReturn, type MapCameraState } from './useMapCamera';
export { useMapState, type MapUIReturn, type MapUIState } from './useMapState';
export { useMapStyle, type MapStyleReturn } from './useMapStyle';
export { useMapSpeedDialActions } from './useMapSpeedDialActions';
export { useSupercluster } from './useSupercluster';
