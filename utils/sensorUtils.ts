import { BoxType, LocationWithBoxes } from '@/api/models/sensor';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
    mapCenter: [number, number] | undefined,
    sensor: LocationWithBoxes
): number => {
    if (!mapCenter || !sensor.location) return 0;

    const [mapLon, mapLat] = mapCenter;
    const sensorLat = sensor.location.coordinates.lat;
    const sensorLon = sensor.location.coordinates.lon;

    const R = 6371; // Earth radius in km
    const dLat = ((sensorLat - mapLat) * Math.PI) / 180;
    const dLon = ((sensorLon - mapLon) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((mapLat * Math.PI) / 180) *
        Math.cos((sensorLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Check if sensor has water boxes (WaterBox or WaterTemperatureOnlyBox)
 */
export const hasWaterBoxes = (sensor: LocationWithBoxes): boolean => {
    return sensor.boxes.some(
        (box) =>
            box.type === BoxType.WaterBox ||
            box.type === BoxType.WaterTemperatureOnlyBox
    );
};

/**
 * Check if sensor has air boxes
 */
export const hasAirBoxes = (sensor: LocationWithBoxes): boolean => {
    return sensor.boxes.some((box) => box.type === BoxType.AirBox);
};

/**
 * Get the latest measurement timestamp for a sensor
 * Returns timestamp in milliseconds since epoch
 */
export const getLatestMeasurementTime = (sensor: LocationWithBoxes): number => {
    let latest = 0;
    for (const box of sensor.boxes) {
        if (box.measurementTimes[0]) {
            const time = new Date(box.measurementTimes[0].time + 'Z').getTime();
            if (time > latest) latest = time;
        }
    }
    return latest;
};

/**
 * Filter sensors by type
 */
export const filterSensorsByType = (
    sensors: LocationWithBoxes[],
    filterType: 'all' | 'water' | 'air'
): LocationWithBoxes[] => {
    if (filterType === 'all') return sensors;

    return sensors.filter((sensor) => {
        if (filterType === 'water') {
            return hasWaterBoxes(sensor);
        } else if (filterType === 'air') {
            return hasAirBoxes(sensor);
        }
        return true;
    });
};
