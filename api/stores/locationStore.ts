import {useHttpClient} from '@/api/client';
import {DetailedLocationDTO, UpdateLocationRequest} from '@/api/models/location';

export function useLocationStore() {
    const httpClient = useHttpClient();

    return {
        // New endpoint for harbor masters - no ID needed!
        getHarborMasterLocation: async (): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>('/harbour/location');
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    return null;
                }
                console.error('Error fetching harbor master location:', error);
                throw error;
            }
        },

        getLocationInfo: async (locationId: number): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.get<DetailedLocationDTO>(`/location/${locationId}`);
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    return null;
                }
                console.error('Error fetching location info:', error);
                throw error;
            }
        },

        updateLocationInfo: async (locationId: number, data: UpdateLocationRequest): Promise<DetailedLocationDTO | null> => {
            try {
                const response = await httpClient.put<DetailedLocationDTO>(`/location/${locationId}`, data);
                return response.data;
            } catch (error: any) {
                console.error('Error updating location info:', error);
                throw error;
            }
        },

        getLocationImageUrl: (locationId: number): string => {
            // Return the full URL for image endpoint
            const baseURL = httpClient.defaults.baseURL || '';
            return `${baseURL}/location/${locationId}/image`;
        },

        deleteLocationImage: async (locationId: number): Promise<boolean> => {
            try {
                await httpClient.delete(`/location/${locationId}/image`);
                return true;
            } catch (error: any) {
                console.error('Error deleting location image:', error);
                throw error;
            }
        }
    };
}