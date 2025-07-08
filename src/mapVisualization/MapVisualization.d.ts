export class MapVisualization {
    constructor(containerId: string, options?: any);

    setModuleVisibility?(moduleName: string, visible: boolean): void;

    setOverlayVisibility?(overlayName: string, visible: boolean): void;

    toggleLayer?(layerName: string): void;

    destroy(): void;

    layers?: any;
} 