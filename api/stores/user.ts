import {UpdateProfileRequest, UserProfile} from '@/api/models/profile';
import {useHttpClient} from '@/api/client';

export function useUserStore() {
    const httpClient = useHttpClient();

    return {
        getProfile: async (): Promise<UserProfile | null> => {
            try {
                const response = await httpClient.get<UserProfile>('/user-profile');
                return response.data;
            } catch (error: unknown) {
                if ((error as any).response?.status === 404) {
                    return null;
                }
                throw error;
            }
        },

        createProfile: async (body: UpdateProfileRequest) => {
            try {
                const response = await httpClient.post<UserProfile>('/user-profile', body);
                return response.data;
            } catch (error: unknown) {
                console.error('Failed to create profile:', error);
                throw error;
            }
        },

        updateProfile: async (body: UpdateProfileRequest) => {
            try {
                const response = await httpClient.put<UserProfile>('/user-profile', body);
                return response.data;
            } catch (error: unknown) {
                console.error('Failed to update profile:', error);
                throw error;
            }
        },
    };
}