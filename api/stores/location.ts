import { useHttpClient } from '@/api/client';
import { DetailedLocationDTO, UpdateLocationRequest } from '@/api/models/location';
import { handleApiError, Result } from '@/utils/errors';
import { api } from '@/utils/api';

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
        getLocations: (): Promise<Result<DetailedLocationDTO[]>> => {
            return api.requestSafe(
                httpClient.get<DetailedLocationDTO[]>('/locations'),
                'LocationStore.getLocations'
            );
        },

        /**
         * Get location by ID
         * @param id - Location ID
         * @returns Promise with location data or null if not found
         */
        getLocationById: (id: number): Promise<Result<DetailedLocationDTO>> => {
            return api.requestSafe(
                httpClient.get<DetailedLocationDTO>(`/location/${id}`),
                'LocationStore.getLocationById'
            );
        },

        /**
         * Get harbor master's location (no ID needed)
         * @returns Promise with location data or null if not found
         */
        getHarborMasterLocation: (): Promise<Result<DetailedLocationDTO>> => {
            return api.requestSafe(
                httpClient.get<DetailedLocationDTO>('/harbour/location'),
                'LocationStore.getHarborMasterLocation'
            );
        },

        /**
         * Get location info by ID
         * @param locationId - Location ID
         * @returns Promise with location data or null if not found
         */
        getLocationInfo: (locationId: number): Promise<Result<DetailedLocationDTO>> => {
            return api.requestSafe(
                httpClient.get<DetailedLocationDTO>(`/location/${locationId}`),
                'LocationStore.getLocationInfo'
            );
        },

        /**
         * Update location info
         * @param locationId - Location ID
         * @param data - Data to update
         * @returns Promise with updated location data or null if failed
         */
        updateLocationInfo: (locationId: number, data: UpdateLocationRequest): Promise<Result<DetailedLocationDTO>> => {
            return api.requestSafe(
                httpClient.put<DetailedLocationDTO>(`/location/${locationId}`, data),
                'LocationStore.updateLocationInfo'
            );
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
        deleteLocationImage: (locationId: number): Promise<Result<void>> => {
            return api.requestVoidSafe(
                httpClient.delete(`/location/${locationId}/image`),
                'LocationStore.deleteLocationImage'
            );
        }
    };
}
