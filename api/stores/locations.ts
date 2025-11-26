import {useHttpClient} from '@/api/client';
import {DetailedLocationDTO} from '@/api/models/location';

export function useLocationStore() {
    const httpClient = useHttpClient();

    return {
        /**
         * Get all locations
         */
        getLocations: async (): Promise<DetailedLocationDTO[]> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO[]>('/locations');
                return response.data;
            } catch (error) {
                console.error('Failed to fetch locations:', error);
                return [];
            }
        },

        /**
         * Get location by ID
         */
        getLocationById: async (id: number): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>(`/location/${id}`);
                return response.data;
            } catch (error) {
                console.error(`Failed to fetch location ${id}:`, error);
                return null;
            }
        }
    };
}
