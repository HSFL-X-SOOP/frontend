import {UpdateProfileRequest, UserProfile} from '@/api/models/profile';
import {useHttpClient} from '@/api/client';
import {Result} from '@/utils/errors';
import {api} from '@/utils/api';

export function useUserStore() {
    const httpClient = useHttpClient();

    return {
        getProfile: (): Promise<Result<UserProfile>> => {
            return api.requestSafe(
                httpClient.get<UserProfile>('/user-profile'),
                'UserStore:getProfile'
            );
        },

        createProfile: (body: UpdateProfileRequest): Promise<Result<UserProfile>> => {
            return api.requestSafe(
                httpClient.post<UserProfile>('/user-profile', body),
                'UserStore:createProfile'
            );
        },

        updateProfile: (body: UpdateProfileRequest): Promise<Result<UserProfile>> => {
            return api.requestSafe(
                httpClient.put<UserProfile>('/user-profile', body),
                'UserStore:updateProfile'
            );
        },
    };
}