import {useCallback, useState} from 'react';
import {DetailedLocationDTO} from '@/api/models/location';
import {useLocationStore} from '@/api/stores/location';
import {AppError} from '@/utils/errors';

/**
 * Hook to fetch all locations from the /locations endpoint
 * Locations are only fetched once when the component mounts
 *
 * Note: Errors are passed to onError callback
 */
export function useLocations() {
    const [loading, setLoading] = useState(true);
    const locationStore = useLocationStore();

    const fetchData = useCallback(async (
        onSuccess: (data: DetailedLocationDTO[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await locationStore.getLocations();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);
    }, [locationStore]);

    const fetchLocationById = useCallback(async (
        id: number,
        onSuccess: (data: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {

        setLoading(true);
        const result = await locationStore.getLocationById(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);
    }, [locationStore]);

    return {loading, fetchData, fetchLocationById};
}
