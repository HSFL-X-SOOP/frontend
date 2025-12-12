import {useCallback, useEffect, useState} from 'react';
import {useLocationStore} from '@/api/stores/location.ts';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {DetailedLocationDTO, UpdateLocationRequest} from '@/api/models/location';
import {AppError, UIError} from '@/utils/errors';

/**
 * Hook for fetching and managing harbor master's location info
 * Can accept initial data to avoid duplicate API calls
 *
 * Note: Errors are passed to onError callback
 */
export function useLocationInfo(initialData?: DetailedLocationDTO | null) {
    const session = useSession();
    const locationStore = useLocationStore();

    const [locationData, setLocationData] = useState<DetailedLocationDTO | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(false);

    const isHarborMaster = session?.session?.role === AuthorityRole.HARBOURMASTER;

    const fetchLocationInfo = useCallback(async (
        onSuccess: (data: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster) {
            onError(new UIError('error.noPermission'));
            return;
        }

        setIsLoading(true);

        const result = await locationStore.getHarborMasterLocation();

        if (result.ok) {
            setLocationData(result.value);
            onSuccess(result.value);
        } else {
            onError(result.error);
        }

        setIsLoading(false);
    }, [isHarborMaster, locationStore]);

    const updateLocationInfo = useCallback(async (
        data: UpdateLocationRequest,
        onSuccess: (updatedData: DetailedLocationDTO) => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster || !locationData?.id) {
            onError(new UIError('error.noPermission'));
            return;
        }

        const result = await locationStore.updateLocationInfo(locationData.id, data);

        if (result.ok) {
            setLocationData(result.value);
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
    }, [isHarborMaster, locationData?.id, locationStore]);

    const deleteImage = useCallback(async (
        onSuccess: () => void,
        onError: (error: AppError) => void
    ) => {
        if (!isHarborMaster || !locationData?.id) {
            onError(new UIError('error.noPermission'));
            return;
        }

        const result = await locationStore.deleteLocationImage(locationData.id);

        if (result.ok) {
            onSuccess();
        } else {
            onError(result.error);
        }
    }, [isHarborMaster, locationData?.id, locationStore]);

    const getImageUrl = useCallback((
        onSuccess: (url: string) => void,
        onError: (error: AppError) => void
    ) => {
        if (!locationData?.id) {
            onError(new UIError('error.notFound'));
            return;
        }
        onSuccess(locationStore.getLocationImageUrl(locationData.id));
    }, [locationData?.id, locationStore]);

    return {
        locationData,
        isLoading,
        fetchLocationInfo,
        updateLocation: updateLocationInfo,
        deleteImage,
        getImageUrl
    };
}