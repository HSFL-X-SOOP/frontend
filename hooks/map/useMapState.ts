import { useState } from 'react';

/**
 * Map UI state management
 * Manages drawer, filter panel, and highlight states
 */

export interface MapUIState {
  // Drawer states
  isDrawerOpen: boolean;
  // Filter panel states
  isFilterOpen: boolean;
  // Highlighted sensor ID for visual feedback
  highlightedSensorId: number | null;
}

export interface MapUIReturn extends MapUIState {
  // Drawer setters
  setIsDrawerOpen: (open: boolean) => void;
  // Filter setters
  setIsFilterOpen: (open: boolean) => void;
  // Highlight setters
  setHighlightedSensorId: (id: number | null) => void;
  // Combined actions
  toggleDrawer: () => void;
  toggleFilter: () => void;
  clearHighlight: () => void;
}

export function useMapState(): MapUIReturn {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [highlightedSensorId, setHighlightedSensorId] = useState<number | null>(null);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const clearHighlight = () => setHighlightedSensorId(null);

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    isFilterOpen,
    setIsFilterOpen,
    highlightedSensorId,
    setHighlightedSensorId,
    toggleDrawer,
    toggleFilter,
    clearHighlight,
  };
}
