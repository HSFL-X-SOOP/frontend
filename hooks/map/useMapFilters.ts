import {useMemo, useState} from 'react';
import {BoxType, LocationWithBoxes} from '@/api/models/sensor';

/**
 * Hook for managing map filter state and filtered content
 * Consolidates filter logic from both Map.native and Map.web implementations
 *
 * @param contentData - Array of locations with boxes to filter
 * @param initialModule1Visible - Initial state for water sensors filter (default: true)
 * @param initialModule2Visible - Initial state for air sensors filter (default: true)
 * @param initialModule3Visible - Initial state for module 3 filter (default: false)
 * @returns Object with filter state, setters, and filtered content
 */
export interface MapFiltersReturn {
    // Filter state
    module1Visible: boolean;
    module2Visible: boolean;
    module3Visible: boolean;
    // Filter setters
    setModule1Visible: (visible: boolean) => void;
    setModule2Visible: (visible: boolean) => void;
    setModule3Visible: (visible: boolean) => void;
    // Computed values
    filteredContent: LocationWithBoxes[];
}

export function useMapFilters(
    contentData: LocationWithBoxes[] | undefined,
    initialModule1Visible: boolean = true,
    initialModule2Visible: boolean = true,
    initialModule3Visible: boolean = false
): MapFiltersReturn {
    // Filter state
    const [module1Visible, setModule1Visible] = useState(initialModule1Visible);
    const [module2Visible, setModule2Visible] = useState(initialModule2Visible);
    const [module3Visible, setModule3Visible] = useState(initialModule3Visible);

    // Compute filtered content based on filter settings
    // Only depends on content and filters that are actually used in the filtering logic
    const filteredContent = useMemo(() => {
        if (!contentData) return [];

        return contentData.filter(locationWithBoxes => {
            const hasWaterBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.WaterBox ||
                box.type === BoxType.WaterTemperatureOnlyBox
            );
            const hasAirBoxes = locationWithBoxes.boxes.some(box =>
                box.type === BoxType.AirBox
            );

            // Module 3 is not currently used in filter logic
            // If you need to filter by module 3, add it here
            if (module1Visible && hasWaterBoxes) return true;
            return module2Visible && hasAirBoxes;
        });
    }, [contentData, module1Visible, module2Visible]);

    return {
        // State
        module1Visible,
        module2Visible,
        module3Visible,
        // Setters
        setModule1Visible,
        setModule2Visible,
        setModule3Visible,
        // Computed
        filteredContent,
    };
}
