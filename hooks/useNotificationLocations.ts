import { CreateOrUpdateNotificationLocationRequest, CreateOrUpdateNotificationLocationResponse, DeleteNotificationLocationResponse, NotificationLocation } from "@/api/models/notificationLocation";
import { useNotificationLocationStore } from "@/api/stores/notificationLocation";
import * as AsyncHandler from "@/hooks/core/asyncHandler";

export const useNotificationLocations = () => {
    const notificationLocationStore = useNotificationLocationStore();

    const [getNotificationLocationByLocationId, getNotificationLocationByLocationIdStatus] =
        AsyncHandler.useAsync<[number], NotificationLocation>(notificationLocationStore.getNotificationLocationByLocationId);

    const [getAllNotificationLocationsByLocationId, getAllNotificationLocationsByLocationIdStatus] =
        AsyncHandler.useAsync<[number], NotificationLocation[]>(notificationLocationStore.getAllNotificationLocationsByLocationId);

    const [create, createStatus] =
        AsyncHandler.useAsync<[CreateOrUpdateNotificationLocationRequest], CreateOrUpdateNotificationLocationResponse>(notificationLocationStore.createNotificationLocation);

    const [deleteNotificationLocation, deleteNotificationLocationStatus] =
        AsyncHandler.useAsync<[number], DeleteNotificationLocationResponse>(notificationLocationStore.deleteNotificationLocation);

    return {
        getNotificationLocationByLocationId,
        getNotificationLocationByLocationIdStatus,

        getAllNotificationLocationsByLocationId,
        getAllNotificationLocationsByLocationIdStatus,

        create,
        createStatus,

        deleteNotificationLocation, 
        deleteNotificationLocationStatus,
    };
};