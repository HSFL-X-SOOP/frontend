import {useState, useCallback} from 'react';
import {LocationWithBoxes} from '@/api/models/sensor';
import {useSensorStore} from '@/api/stores/sensors';
import {AppError, UIError} from "@/utils/errors.ts";


/**
 * Hook to fetch sensor data with location boxes (new API format)
 *
 * Note: Errors are thrown and should be caught by the calling component
 */
export function useSensorDataNew() {
    const [loading, setLoading] = useState(true);
    const sensorStore = useSensorStore();

    const fetchData = useCallback(async (onSuccess: (data: LocationWithBoxes[]) => void, onError: (error: AppError) => void) => {
        setLoading(true)

        const result = await sensorStore.getSensorDataNew();
        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);

    }, []);


    return {loading, fetchData};
}

/**
 * Hook to fetch sensor data for a specific location within a time range (FAST API)
 * Uses the new FAST endpoint which includes backend-side data aggregation
 *
 * Note: Errors are thrown and should be caught by the calling component
 */
export function useSensorDataTimeRange(id: number | null, timeRange: string = '24h') {
    const [loading, setLoading] = useState(false);
    const sensorStore = useSensorStore();

    const fetchData = useCallback(async (onSuccess: (data: LocationWithBoxes) => void, onError: (error: AppError) => void) => {
        setLoading(true)
        if (id == null) {
            onError(new UIError('error.notFoundSensor'));
            return;
        }

        const result = await sensorStore.getSensorDataTimeRangeFAST(id, timeRange);
        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);

    }, [id, timeRange]);


    return {loading, fetchData};
}
