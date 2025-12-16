import {useHttpClient} from '@/api/client';
import {RegisterUserDeviceRequest, RegisterUserDeviceResponse} from '../models/auth';
import {Result} from '@/utils/errors';
import {api} from '@/utils/api';

export function useUserDeviceStore() {
    const httpClient = useHttpClient();

    return {
        /**
         * Register user device
         * Returns Result - non-critical operation
         */
        registerUserDevice: (body: RegisterUserDeviceRequest): Promise<Result<RegisterUserDeviceResponse>> => {
            return api.requestSafe(
                httpClient.post<RegisterUserDeviceResponse>('/user-device', body),
                'UserDeviceStore:registerUserDevice'
            );
        },
    };
}
