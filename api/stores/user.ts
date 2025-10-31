import {UpdateProfileRequest, UserProfile} from '@/api/models/profile';
import {useHttpClient} from '@/api/client';

export function useUserStore() {
    const httpClient = useHttpClient();

    return {
        getProfile: async (): Promise<UserProfile | null> => {
            try {
                const response = await httpClient.get<UserProfile>('/user-profile');
                return response.data;
            } catch (error: any) {
                if (error.response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },

        createProfile: async (body: UpdateProfileRequest) => {
            console.log('[API] Creating profile with body:', JSON.stringify(body, null, 2));
            try {
                const response = await httpClient.post<UserProfile>('/user-profile', body);
                console.log('[API] Profile created successfully:', response.data);
                return response.data;
            } catch (error: any) {
                console.error('[API] Profile creation failed:', error.response?.data || error.message);
                console.error('[API] Full error object:', error);
                throw error;
            }
        },

        updateProfile: (body: UpdateProfileRequest) =>
            httpClient.put<UserProfile>('/user-profile', body).then(r => r.data),
    };
}