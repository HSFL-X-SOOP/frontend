import {useCallback, useState, useEffect} from 'react';
import {DetailedLocationDTO} from '@/api/models/location';
import {useSession} from '@/context/SessionContext';
import {useLocationStore} from '@/api/stores/location';
import {AppError, UIError} from '@/utils/errors';

/**
 * Hook to fetch all locations from the /locations endpoint
 * Locations are only fetched once when the component mounts
 *
 * Note: Errors are passed to onError callback
 */
export function useLocations() {
    const [loading, setLoading] = useState(true);
    const {session} = useSession();
    const locationStore = useLocationStore();

    const fetchData = useCallback(async (
        onSuccess: (data: DetailedLocationDTO[]) => void,
        onError: (error: AppError) => void
    ) => {
        if (!session?.accessToken) {
            onError(new UIError('errors.unauthorized'));
            return;
        }

        setLoading(true);
        const result = await locationStore.getLocations();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);
    }, [session?.accessToken, locationStore]);

    const fetchLocationById = useCallback(async (
        id: number,
        onSuccess: (data: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {
        if (!session?.accessToken) {
            onError(new UIError('errors.unauthorized'));
            return;
        }

        setLoading(true);
        const result = await locationStore.getLocationById(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setLoading(false);
    }, [session?.accessToken, locationStore]);

    return {loading, fetchData, fetchLocationById};
}
