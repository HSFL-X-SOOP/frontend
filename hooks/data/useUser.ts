import {useCallback, useState} from 'react';
import { UpdateProfileRequest, UserProfile } from '@/api/models/profile';
import { useUserStore } from '@/api/stores/user';
import {AppError} from '@/utils/errors';

/**
 * Hook for managing user profile with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useUser = () => {
    const userStore = useUserStore();
    const [loading, setLoading] = useState(false);

    const getProfile = useCallback(async (
        onSuccess: (data: UserProfile) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userStore.getProfile();

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userStore]);

    const createProfile = useCallback(async (
        body: UpdateProfileRequest,
        onSuccess: (data: UserProfile) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userStore.createProfile(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userStore]);

    const updateProfile = useCallback(async (
        body: UpdateProfileRequest,
        onSuccess: (data: UserProfile) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userStore.updateProfile(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userStore]);

    return {
        loading,
        getProfile,
        createProfile,
        updateProfile
    };
};
