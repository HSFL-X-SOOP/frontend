import {useCallback} from 'react';
import {useLocationStore} from '@/api/stores/location.ts';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {DetailedLocationDTO, UpdateLocationRequest} from '@/api/models/location';
import {AppError, UIError} from '@/utils/errors';

/**
 * Hook for performing harbor master's location operations
 * Component must manage its own locationData state and pass it as needed
 *
 * Note: Errors are passed to onError callback
 */
export function useLocationInfo() {
    const session = useSession();
    const locationStore = useLocationStore();

    const isHarborMaster = session?.session?.role === AuthorityRole.HARBOURMASTER;

    const fetchLocationInfo = useCallback(async (
        onSuccess: (data: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster) {
            onError(new UIError('errors.unauthorized'));
            return;
        }

        const result = await locationStore.getHarborMasterLocation();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
    }, [isHarborMaster, locationStore]);

    const updateLocationInfo = useCallback(async (
        locationId: number,
        data: UpdateLocationRequest,
        onSuccess: (updatedData: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster) {
            onError(new UIError('errors.unauthorized'));
            return;
        }

        const result = await locationStore.updateLocationInfo(locationId, data);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
    }, [isHarborMaster, locationStore]);

    const deleteImage = useCallback(async (
        locationId: number,
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster) {
            onError(new UIError('errors.unauthorized'));
            return;
        }

        const result = await locationStore.deleteLocationImage(locationId);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
    }, [isHarborMaster, locationStore]);

    const getImageUrl = useCallback((
        locationId: number,
        onSuccess: (url: string) => void,
        onError: (error: AppError) => void
    ) => {
        if (!locationId) {
            onError(new UIError('errors.notFound'));
            return;
        }
        onSuccess(locationStore.getLocationImageUrl(locationId));
    }, [locationStore]);

    return {
        isHarborMaster,
        fetchLocationInfo,
        updateLocation: updateLocationInfo,
        deleteImage,
        getImageUrl
    };
}