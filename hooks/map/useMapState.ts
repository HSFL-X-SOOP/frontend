import { useState, Dispatch, SetStateAction } from 'react';

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
  // Drawer setters - supports both boolean and functional updates
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  // Filter setters
  setIsFilterOpen: Dispatch<SetStateAction<boolean>>;
  // Highlight setters
  setHighlightedSensorId: Dispatch<SetStateAction<number | null>>;
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
