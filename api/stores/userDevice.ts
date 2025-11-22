import {useHttpClient} from '@/api/client';
import {DetailedLocationDTO} from '@/api/models/location';
import { RegisterUserDeviceRequest, RegisterUserDeviceResponse } from '../models/auth';

export function useUserDeviceStore() {
    const httpClient = useHttpClient();

    return {
        /**
         * Register user device
         */
        registerUserDevice: async (body: RegisterUserDeviceRequest): Promise<RegisterUserDeviceResponse[]> => {
            try {
                const response = await httpClient.post<RegisterUserDeviceResponse[]>('/user-device', body);
                return response.data;
            } catch (error) {
                console.error('Failed to register user device:', error);
                return [];
            }
        },
    };
}
