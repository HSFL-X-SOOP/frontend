export class MapVisualization {
  constructor(containerId: string, options?: any);
  setOverlayVisibility?(overlayName: string, visible: boolean): void;
  toggleLayer?(layerName: string): void;
  destroy(): void;
  layers?: any;
} 