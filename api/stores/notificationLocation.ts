import {
    CreateOrUpdateNotificationLocationRequest,
    CreateOrUpdateNotificationLocationResponse,
    DeleteNotificationLocationResponse,
    NotificationLocation,
} from "@/api/models/notificationLocation.ts";
import { useHttpClient } from "@/api/client.ts";
import { Result } from "@/utils/errors";
import { api } from "@/utils/api";

export function useNotificationLocationStore() {
    const httpClient = useHttpClient();

    return {
        getNotificationLocationByLocationId: (locationId: number): Promise<Result<NotificationLocation>> => {
            return api.requestSafe(
                httpClient.get<NotificationLocation>(`/notification-locations/${locationId}`),
                'NotificationLocationStore:getNotificationLocationByLocationId'
            );
        },

        getAllNotificationLocationsByLocationId: (locationId: number): Promise<Result<NotificationLocation[]>> => {
            return api.requestSafe(
                httpClient.get<NotificationLocation[]>(`/notification-locations/all/${locationId}`),
                'NotificationLocationStore:getAllNotificationLocationsByLocationId'
            );
        },

        createNotificationLocation: (body: CreateOrUpdateNotificationLocationRequest): Promise<Result<CreateOrUpdateNotificationLocationResponse>> => {
            return api.requestSafe(
                httpClient.post<CreateOrUpdateNotificationLocationResponse>("/notification-locations", body),
                'NotificationLocationStore:createNotificationLocation'
            );
        },

        deleteNotificationLocation: (id: number): Promise<Result<DeleteNotificationLocationResponse>> => {
            return api.requestSafe(
                httpClient.delete<DeleteNotificationLocationResponse>(`/notification-locations/${id}`),
                'NotificationLocationStore:deleteNotificationLocation'
            );
        },
    };
}
