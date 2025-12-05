import { UpdateProfileRequest, UserProfile } from '@/api/models/profile';
import { useUserStore } from '@/api/stores/user';
import * as AsyncHandler from '@/hooks/core/asyncHandler';

export const useUser = () => {
    const userStore = useUserStore();

    const [getProfile, getProfileStatus] =
        AsyncHandler.useAsync<[], UserProfile | null>(userStore.getProfile);

    const [createProfile, createProfileStatus] =
        AsyncHandler.useAsync<[UpdateProfileRequest], UserProfile>(userStore.createProfile);

    const [updateProfile, updateProfileStatus] =
        AsyncHandler.useAsync<[UpdateProfileRequest], UserProfile>(userStore.updateProfile);

    return {
        getProfile,
        getProfileStatus,

        createProfile,
        createProfileStatus,

        updateProfile,
        updateProfileStatus,
    };
};
