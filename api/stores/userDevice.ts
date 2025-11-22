import {useHttpClient} from '@/api/client';
import { RegisterUserDeviceRequest, RegisterUserDeviceResponse } from '../models/auth';

export function useUserDeviceStore() {
    const httpClient = useHttpClient();

    return {
        /**
         * Register user device
         */
        registerUserDevice: async (body: RegisterUserDeviceRequest): Promise<RegisterUserDeviceResponse | null> => {
            try {
                const response = await httpClient.post<RegisterUserDeviceResponse>('/user-device', body);
                return response.data;
            } catch (error) {
                console.error('Failed to register user device:', error);
                return null;
            }
        },
    };
}
