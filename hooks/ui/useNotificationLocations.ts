import {useCallback, useState} from "react";
import { CreateOrUpdateNotificationLocationRequest, CreateOrUpdateNotificationLocationResponse, DeleteNotificationLocationResponse, NotificationLocation } from "@/api/models/notificationLocation";
import { useNotificationLocationStore } from "@/api/stores/notificationLocation";
import {AppError} from "@/utils/errors";

/**
 * Hook for managing notification locations with Result pattern
 *
 * Note: Errors are passed to onError callback
 */
export const useNotificationLocations = () => {
    const notificationLocationStore = useNotificationLocationStore();
    const [loading, setLoading] = useState(false);

    const getNotificationLocationByLocationId = useCallback(async (
        locationId: number,
        onSuccess: (data: NotificationLocation) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationLocationStore.getNotificationLocationByLocationId(locationId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationLocationStore]);

    const getAllNotificationLocationsByLocationId = useCallback(async (
        locationId: number,
        onSuccess: (data: NotificationLocation[]) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationLocationStore.getAllNotificationLocationsByLocationId(locationId);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationLocationStore]);

    const create = useCallback(async (
        body: CreateOrUpdateNotificationLocationRequest,
        onSuccess: (data: CreateOrUpdateNotificationLocationResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationLocationStore.createNotificationLocation(body);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationLocationStore]);

    const deleteNotificationLocation = useCallback(async (
        id: number,
        onSuccess: (data: DeleteNotificationLocationResponse) => void,
        onError: (error: AppError) => void
    ) => {
        setLoading(true);
        const result = await notificationLocationStore.deleteNotificationLocation(id);

        if (result.ok) {
            onSuccess(result.value);
        } else {
            onError(result.error);
        }
        setLoading(false);
    }, [notificationLocationStore]);

    return {
        loading,
        getNotificationLocationByLocationId,
        getAllNotificationLocationsByLocationId,
        create,
        deleteNotificationLocation
    };
};