import { LocationWithBoxes } from '@/api/models/sensor';
import { ChartTimeRange } from '@/components/dashboard';
import { getLatestMeasurements } from '@/utils/measurements';

/**
 * Measurements to exclude from display
 */
export const EXCLUDED_MEASUREMENTS = ["Standard deviation", "Battery, voltage"];

/**
 * Preferred order for displaying measurements
 */
export const MEASUREMENT_ORDER = ["Temperature, water", "Tide", "Wave Height"];

/**
 * Maps UI time range to API time range format
 */
export const mapTimeRangeToApi = (timeRange: ChartTimeRange): string => {
    const mapping: Record<ChartTimeRange, string> = {
        'today': '24h',
        'yesterday': '48h',
        'last7days': '7d',
        'last30days': '30d',
        'last90days': '90d',
        'last180days': '180d',
        'last1year': '1y'
    };
    return mapping[timeRange] ?? '24h';
};

/**
 * Filters and sorts measurements based on exclusion list and preferred order
 */
export const getFilteredMeasurements = (timeRangeData: LocationWithBoxes | null) => {
    if (!timeRangeData?.boxes) return [];

    const latestMeasurements = getLatestMeasurements(timeRangeData.boxes);
    const filtered = latestMeasurements.filter(m => !EXCLUDED_MEASUREMENTS.includes(m.measurementType));

    return filtered.sort((a, b) => {
        const indexA = MEASUREMENT_ORDER.indexOf(a.measurementType);
        const indexB = MEASUREMENT_ORDER.indexOf(b.measurementType);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
};

/**
 * Extracts current values for key measurements
 */
export const getCurrentValues = (filteredMeasurements: ReturnType<typeof getFilteredMeasurements>) => ({
    waterTemp: filteredMeasurements.find(m =>
        m.measurementType === "Temperature, water" || m.measurementType === "WTemp"
    )?.value,
    waveHeight: filteredMeasurements.find(m => m.measurementType === "Wave Height")?.value,
    waterLevel: filteredMeasurements.find(m => m.measurementType === "Tide")?.value
});

/**
 * Type guard for measurement type IDs
 */
export type MeasurementTypeId =
    | "Temperature, water"
    | "WTemp"
    | "1603253327"
    | "Wave Height"
    | "-1705811922"
    | "Tide"
    | "2606550"
    | string;

/**
 * Gets the current value for a specific measurement type
 */
export const getCurrentValueByType = (
    currentValues: ReturnType<typeof getCurrentValues>,
    type: MeasurementTypeId
): number | null | undefined => {
    switch (type) {
        case "Temperature, water":
        case "WTemp":
        case "1603253327":
            return currentValues.waterTemp;
        case "Wave Height":
        case "-1705811922":
            return currentValues.waveHeight;
        case "Tide":
        case "2606550":
            return currentValues.waterLevel;
        default:
            return null;
    }
};
