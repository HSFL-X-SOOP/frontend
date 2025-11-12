import {useEffect, useState} from 'react';
import {useLocationStore} from '@/api/stores/locationStore';
import {useSession} from '@/context/SessionContext';
import {AuthorityRole} from '@/api/models/profile';
import {DetailedLocationDTO, UpdateLocationRequest} from '@/api/models/location';

/**
 * Hook for fetching and managing harbor master's location info
 * Can accept initial data to avoid duplicate API calls
 */
export function useLocationInfo(initialData?: DetailedLocationDTO | null) {
    const session = useSession();
    const locationStore = useLocationStore();

    const [locationData, setLocationData] = useState<DetailedLocationDTO | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user is harbor master
    const isHarborMaster = session?.session?.role === AuthorityRole.HARBOURMASTER;

    const fetchLocationInfo = async () => {
        if (!isHarborMaster) return;

        setIsLoading(true);
        setError(null);

        try {
            // Use the new endpoint that doesn't need an ID
            const data = await locationStore.getHarborMasterLocation();
            setLocationData(data);
            return data;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch location info';
            setError(errorMessage);
            console.error('Error fetching location info:', err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateLocationInfo = async (data: UpdateLocationRequest) => {
        if (!isHarborMaster || !locationData?.id) {
            throw new Error('No permission to update location or location not loaded');
        }

        try {
            // Use the location ID from the fetched data
            const updatedData = await locationStore.updateLocationInfo(locationData.id, data);
            setLocationData(updatedData);
            return updatedData;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update location info';
            setError(errorMessage);
            throw err;
        }
    };

    const deleteImage = async () => {
        if (!isHarborMaster || !locationData?.id) {
            throw new Error('No permission to delete image or location not loaded');
        }

        try {
            // Use the location ID from the fetched data
            await locationStore.deleteLocationImage(locationData.id);
            return true;
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete image';
            setError(errorMessage);
            throw err;
        }
    };

    const clearError = () => {
        setError(null);
    };

    const getImageUrl = () => {
        if (!locationData?.id) return '';
        return locationStore.getLocationImageUrl(locationData.id);
    };

    useEffect(() => {
        // Only fetch if user is harbor master and we don't have initial data
        if (isHarborMaster && !initialData && !locationData) {
            fetchLocationInfo();
        }
    }, [isHarborMaster]);

    // Update local state when initial data changes - only run once on mount
    useEffect(() => {
        if (initialData) {
            setLocationData(initialData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        locationData,
        locationId: locationData?.id,
        isLoading,
        error,
        isHarborMaster,
        updateLocation: isHarborMaster && locationData?.id ? updateLocationInfo : undefined,
        deleteImage: isHarborMaster && locationData?.id ? deleteImage : undefined,
        getImageUrl: locationData?.id ? getImageUrl : undefined,
        clearError,
        refetch: isHarborMaster ? fetchLocationInfo : undefined
    };
}