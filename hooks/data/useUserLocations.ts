import {useCallback, useState} from "react";
import {
    CreateOrUpdateUserLocationRequest, CreateOrUpdateUserLocationResponse,
    DeleteUserLocationResponse,
    UserLocation
} from "@/api/models/userLocation";
import { useUserLocationStore } from "@/api/stores/userLocation";
import {AppError} from "@/utils/errors";

/**
 * Hook for managing user locations with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useUserLocations = () => {
    const userLocationStore = useUserLocationStore();
    const [loading, setLoading] = useState(false);

    const getAllUserLocationByUserId = useCallback(async (
        userId: number,
        onSuccess: (data: UserLocation[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userLocationStore.getAllUserLocationByUserId(userId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userLocationStore]);

    const getUserLocationByUserIdAndLocationId = useCallback(async (
        userId: number,
        locationId: number,
        onSuccess: (data: UserLocation) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userLocationStore.getUserLocationByUserIdAndLocationId(userId, locationId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userLocationStore]);

    const create = useCallback(async (
        body: CreateOrUpdateUserLocationRequest,
        onSuccess: (data: CreateOrUpdateUserLocationResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userLocationStore.createUserLocation(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userLocationStore]);

    const update = useCallback(async (
        id: number,
        body: CreateOrUpdateUserLocationRequest,
        onSuccess: (data: CreateOrUpdateUserLocationResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userLocationStore.updateUserLocation(id, body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userLocationStore]);

    const deleteUserLocation = useCallback(async (
        id: number,
        onSuccess: (data: DeleteUserLocationResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await userLocationStore.deleteUserLocation(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [userLocationStore]);

    return {
        loading,
        getAllUserLocationByUserId,
        getUserLocationByUserIdAndLocationId,
        create,
        update,
        deleteUserLocation
    };
};
