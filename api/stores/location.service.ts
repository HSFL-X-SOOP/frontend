import { useHttpClient } from '@/api/client';
import { DetailedLocationDTO, UpdateLocationRequest } from '@/api/models/location';
import { handleApiError } from '@/utils/errors';

/**
 * Unified Location Store - Combines all location-related API operations
 * Replaces the duplicate locations.ts and locationStore.ts files
 */
export function useLocationStore() {
    const httpClient = useHttpClient();

    return {
        /**
         * Get all locations
         * @returns Promise with array of all locations
         */
        getLocations: async (): Promise<DetailedLocationDTO[]> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO[]>('/locations');
                return response.data;
            } catch (error) {
                handleApiError(error, 'LocationStore.getLocations');
                return [];
            }
        },

        /**
         * Get location by ID
         * @param id - Location ID
         * @returns Promise with location data or null if not found
         */
        getLocationById: async (id: number): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>(`/location/${id}`);
                return response.data;
            } catch (error) {
                const appError = handleApiError(error, 'LocationStore.getLocationById');
                if (appError.isNotFound()) {
                    return null;
                }
                throw appError;
            }
        },

        /**
         * Get harbor master's location (no ID needed)
         * @returns Promise with location data or null if not found
         */
        getHarborMasterLocation: async (): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>('/harbour/location');
                return response.data;
            } catch (error) {
                const appError = handleApiError(error, 'LocationStore.getHarborMasterLocation');
                if (appError.isNotFound()) {
                    return null;
                }
                throw appError;
            }
        },

        /**
         * Get location info by ID
         * @param locationId - Location ID
         * @returns Promise with location data or null if not found
         */
        getLocationInfo: async (locationId: number): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>(`/location/${locationId}`);
                return response.data;
            } catch (error) {
                const appError = handleApiError(error, 'LocationStore.getLocationInfo');
                if (appError.isNotFound()) {
                    return null;
                }
                throw appError;
            }
        },

        /**
         * Update location info
         * @param locationId - Location ID
         * @param data - Data to update
         * @returns Promise with updated location data or null if failed
         */
        updateLocationInfo: async (locationId: number, data: UpdateLocationRequest): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.put<DetailedLocationDTO>(`/location/${locationId}`, data);
                return response.data;
            } catch (error) {
                throw handleApiError(error, 'LocationStore.updateLocationInfo');
            }
        },

        /**
         * Get full URL for location image
         * @param locationId - Location ID
         * @returns Full image URL
         */
        getLocationImageUrl: (locationId: number): string => {
            const baseURL = httpClient.defaults.baseURL || '';
            return `${baseURL}/location/${locationId}/image`;
        },

        /**
         * Delete location image
         * @param locationId - Location ID
         * @returns Promise<boolean> indicating success
         */
        deleteLocationImage: async (locationId: number): Promise<boolean> => {
            try {
                await httpClient.delete(`/location/${locationId}/image`);
                return true;
            } catch (error) {
                throw handleApiError(error, 'LocationStore.deleteLocationImage');
            }
        }
    };
}
